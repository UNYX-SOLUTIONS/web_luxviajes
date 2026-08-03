import { DatafastService } from '../../services/datafast/datafast.service';
import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { PaymentStatus, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ICreateCheckoutRequest, ITokenPaymentRequest, IPaymentStatusResponse } from '../../services/datafast/types/datafast.types';
import { StatusMapper } from '../../services/datafast/types/datafast.types';

interface CreateCheckoutInput {
  amount: number;
  customer: ICreateCheckoutRequest['customer'];
  billing: ICreateCheckoutRequest['billing'];
  taxes: ICreateCheckoutRequest['taxes'];
  shipping?: ICreateCheckoutRequest['shipping'];
  items?: ICreateCheckoutRequest['items'];
  creditType?: string;
  installments?: number;
  createRegistration?: boolean;
}

interface RecurringPaymentInput {
  tokenId: string;
  amount: number;
  taxes: ITokenPaymentRequest['taxes'];
}

interface UpdateTransactionParams {
  transactionId: string;
  status: PaymentStatus;
  paymentId?: string;
  resultCode?: string;
  resultDescription?: string;
  responseCode?: string;
  authCode?: string;
  acquirerCode?: string;
  acquirerName?: string;
  metadata?: Record<string, unknown>;
}

export class PaymentService {
  private datafastService: DatafastService;

  constructor() {
    this.datafastService = new DatafastService();
  }

  async createCheckout(data: CreateCheckoutInput) {
    const merchantTransactionId = `TRX_${Date.now()}_${uuidv4().slice(0, 8)}`;

    const customer = await prisma.customer.upsert({
      where: { email: data.customer.email },
      create: {
        merchantCustomerId: data.customer.merchantCustomerId || `CUST_${uuidv4().slice(0, 8)}`,
        givenName: data.customer.givenName,
        surname: data.customer.surname,
        email: data.customer.email,
        phone: data.customer.phone,
        identificationDocId: data.customer.identificationDocId,
        identificationDocType: data.customer.identificationDocType || 'IDCARD',
        address: data.billing.street1,
      },
      update: {
        givenName: data.customer.givenName,
        surname: data.customer.surname,
        phone: data.customer.phone,
        identificationDocId: data.customer.identificationDocId,
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        merchantTransactionId,
        amount: data.amount,
        currency: 'USD',
        paymentType: 'DB',
        status: 'PENDING',
        base0: data.taxes.base0,
        baseImp: data.taxes.baseImp,
        iva: data.taxes.iva,
        customerId: customer.id,
        items: (data.items as unknown as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        metadata: data.creditType || data.installments
          ? { creditType: data.creditType, installments: data.installments }
          : undefined,
      },
    });

    try {
      const checkoutResponse = await this.datafastService.createCheckout({
        ...data,
        merchantTransactionId,
        createRegistration: data.createRegistration,
      });

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { checkoutId: checkoutResponse.id },
      });

      return {
        checkoutId: checkoutResponse.id,
        transactionId: transaction.id,
        merchantTransactionId,
      };
    } catch (error) {
      await this.markTransactionFailed(transaction.id, error);
      throw error;
    }
  }

  async getPaymentStatus(resourcePath: string) {
    const paymentData = await this.datafastService.getPaymentStatus(resourcePath);

    if (!paymentData?.result?.code) {
      return paymentData;
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { checkoutId: paymentData.id },
          { paymentId: paymentData.id },
        ],
      },
    });

    if (transaction) {
      const status = this.mapStatus(paymentData.result.code);

      await this.updateTransactionStatus({
        transactionId: transaction.id,
        status,
        paymentId: paymentData.id,
        resultCode: paymentData.result.code,
        resultDescription: paymentData.result.description,
        responseCode: paymentData.resultDetails?.ResponseCode,
        authCode: paymentData.resultDetails?.AuthCode,
        acquirerCode: paymentData.resultDetails?.AcquirerCode,
        acquirerName: paymentData.resultDetails?.clearingInstituteName,
        metadata: {
          ...(transaction.metadata as Record<string, unknown> ?? {}),
          resultDetails: paymentData.resultDetails as unknown as Prisma.InputJsonValue,
        },
      });

      if (status === 'SUCCESS' && paymentData.registrationId) {
        await this.saveToken(
          paymentData.registrationId,
          transaction.customerId,
          paymentData.resultDetails
        );
      }
    }

    return paymentData;
  }

  async refundTransaction(data: { transactionId: string; amount: number; reason?: string }) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: data.transactionId },
    });

    if (!transaction) throw new Error('Transacción no encontrada');
    if (transaction.status !== 'SUCCESS') throw new Error('Solo se pueden anular transacciones exitosas');
    if (!transaction.paymentId) throw new Error('La transacción no tiene paymentId');

    const refundData = {
      amount: data.amount,
      merchantTransactionId: `RF_${Date.now()}_${uuidv4().slice(0, 8)}`,
    };

    const refundResponse = await this.datafastService.refundTransaction(
      transaction.paymentId,
      refundData
    );

    await prisma.refund.create({
      data: {
        transactionId: transaction.id,
        amount: data.amount,
        refundId: refundResponse.id,
        status: refundResponse.result.code === '000.000.000' ? 'COMPLETED' : 'PROCESSING',
        reason: data.reason,
      },
    });

    if (refundResponse.result.code === '000.000.000') {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'REFUNDED' },
      });
    }

    return refundResponse;
  }

  async verifyTransaction(paymentId: string) {
    const paymentData = await this.datafastService.verifyTransactionByPaymentId(paymentId);

    const transaction = await prisma.transaction.findFirst({
      where: { paymentId: paymentData.id },
    });

    if (transaction) {
      await this.updateTransactionStatus({
        transactionId: transaction.id,
        status: this.mapStatus(paymentData.result.code),
        resultCode: paymentData.result.code,
        resultDescription: paymentData.result.description,
        responseCode: paymentData.resultDetails?.ResponseCode,
        authCode: paymentData.resultDetails?.AuthCode,
      });
    }

    return paymentData;
  }

  async createRecurringPayment(data: RecurringPaymentInput) {
    const token = await prisma.token.findUnique({
      where: { id: data.tokenId },
    });

    if (!token) throw new Error('Token no encontrado');
    if (!token.isActive) throw new Error('Token inactivo');

    const merchantTransactionId = `REC_${Date.now()}_${uuidv4().slice(0, 8)}`;

    const transaction = await prisma.transaction.create({
      data: {
        merchantTransactionId,
        amount: data.amount,
        currency: 'USD',
        paymentType: 'DB',
        status: 'PENDING',
        base0: data.taxes.base0,
        baseImp: data.taxes.baseImp,
        iva: data.taxes.iva,
        customerId: token.customerId,
      },
    });

    try {
      const response = await this.datafastService.createRecurringPayment(
        token.registrationId,
        { ...data, merchantTransactionId }
      );

      await this.updateTransactionStatus({
        transactionId: transaction.id,
        status: this.mapStatus(response.result.code),
        paymentId: response.id,
        resultCode: response.result.code,
        resultDescription: response.result.description,
        responseCode: response.resultDetails?.ResponseCode,
        authCode: response.resultDetails?.AuthCode,
      });

      return { ...response, transactionId: transaction.id };
    } catch (error) {
      await this.markTransactionFailed(transaction.id, error);
      throw error;
    }
  }

  async deleteToken(registrationId: string) {
    await this.datafastService.deleteToken(registrationId);

    await prisma.token.updateMany({
      where: { registrationId },
      data: { isActive: false },
    });

    return { success: true };
  }

  private async updateTransactionStatus(params: UpdateTransactionParams) {
    const data: Record<string, unknown> = { status: params.status };

    if (params.paymentId !== undefined) data.paymentId = params.paymentId;
    if (params.resultCode !== undefined) data.resultCode = params.resultCode;
    if (params.resultDescription !== undefined) data.resultDescription = params.resultDescription;
    if (params.responseCode !== undefined) data.responseCode = params.responseCode;
    if (params.authCode !== undefined) data.authCode = params.authCode;
    if (params.acquirerCode !== undefined) data.acquirerCode = params.acquirerCode;
    if (params.acquirerName !== undefined) data.acquirerName = params.acquirerName;
    if (params.metadata !== undefined) data.metadata = params.metadata;

    await prisma.transaction.update({
      where: { id: params.transactionId },
      data: data as any,
    });
  }

  private async markTransactionFailed(transactionId: string, error: unknown) {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'FAILED',
        errorDetails: {
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : 'UnknownError',
        },
      },
    });
  }

  private async saveToken(
    registrationId: string,
    customerId: string,
    resultDetails: IPaymentStatusResponse['resultDetails']
  ) {
    try {
      const lastFourDigits = resultDetails?.LastFourDigits || '****';
      const cardType = resultDetails?.CardType || null;
      const expiryDate = resultDetails?.ExpiryDate || null;

      await prisma.token.upsert({
        where: { registrationId },
        create: {
          registrationId,
          customerId,
          lastFourDigits,
          cardType,
          expiryDate,
        },
        update: {
          lastFourDigits,
          cardType,
          expiryDate,
          isActive: true,
        },
      });

      logger.info(`Token guardado: ${registrationId} para cliente ${customerId}`);
    } catch (error) {
      logger.error({ err: error }, 'Error guardando token');
      throw error;
    }
  }

  private mapStatus(code: string): PaymentStatus {
    if (!code) return 'FAILED';

    const mapped = StatusMapper[code];
    if (mapped) return mapped.status as unknown as PaymentStatus;

    if (code.startsWith('000.100.')) return 'SUCCESS';
    return 'FAILED';
  }
}
