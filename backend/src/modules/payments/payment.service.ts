import { DatafastService } from '../../services/datafast/datafast.service';
import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { PaymentStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
  private datafastService: DatafastService;

  constructor() {
    this.datafastService = new DatafastService();
  }

  async createCheckout(data: any) {
    const merchantTransactionId = `TRX_${Date.now()}_${uuidv4().slice(0, 8)}`;

    // Crear registro de transacción en BD
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
        customerId: data.customer.merchantCustomerId,
        items: data.items || [],
        metadata: {
          creditType: data.creditType,
          installments: data.installments,
        },
      },
    });

    try {
      // Llamar a Datafast
      const checkoutData = {
        ...data,
        merchantTransactionId,
        // Asegurar que el merchantCustomerId exista en la BD
        customer: {
          ...data.customer,
          merchantCustomerId: transaction.customerId,
        },
      };

      const checkoutResponse = await this.datafastService.createCheckout(checkoutData);

      // Actualizar transacción con checkoutId
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          checkoutId: checkoutResponse.id,
        },
      });

      return {
        checkoutId: checkoutResponse.id,
        transactionId: transaction.id,
        merchantTransactionId,
      };
    } catch (error) {
      // Marcar transacción como fallida
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
          errorDetails: error instanceof Error ? { message: error.message, name: error.name } : String(error),
        },
      });
      throw error;
    }
  }

  async getPaymentStatus(resourcePath: string) {
    try {
      const paymentData = await this.datafastService.getPaymentStatus(resourcePath);
      
      // Buscar transacción por checkoutId o paymentId
      const transaction = await prisma.transaction.findFirst({
        where: {
          OR: [
            { checkoutId: paymentData.id },
            { paymentId: paymentData.id },
          ],
        },
      });

      if (transaction) {
        // Actualizar estado
        const status = this.mapStatus(paymentData.result.code);
        
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            paymentId: paymentData.id,
            status,
            resultCode: paymentData.result.code,
            resultDescription: paymentData.result.description,
            responseCode: paymentData.resultDetails?.ResponseCode,
            authCode: paymentData.resultDetails?.AuthCode,
            acquirerCode: paymentData.resultDetails?.AcquirerCode,
            acquirerName: paymentData.resultDetails?.clearingInstituteName,
            metadata: {
              ...(transaction.metadata as any || {}),
              resultDetails: paymentData.resultDetails,
            },
          },
        });

        // Si la transacción fue exitosa y se creó un token, guardarlo
        if (status === 'SUCCESS' && paymentData.registrationId) {
          await this.saveToken(
            paymentData.registrationId,
            transaction.customerId,
            paymentData
          );
        }
      }

      return paymentData;
    } catch (error) {
      logger.error({ err: error }, 'Error obteniendo estado');
      throw error;
    }
  }

  async refundTransaction(data: { transactionId: string; amount: number; reason?: string }) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: data.transactionId },
    });

    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    if (transaction.status !== 'SUCCESS') {
      throw new Error('Solo se pueden anular transacciones exitosas');
    }

    if (!transaction.paymentId) {
      throw new Error('La transacción no tiene paymentId');
    }

    try {
      const refundData = {
        amount: data.amount,
        merchantTransactionId: `RF_${Date.now()}_${uuidv4().slice(0, 8)}`,
      };

      const refundResponse = await this.datafastService.refundTransaction(
        transaction.paymentId,
        refundData
      );

      // Crear registro de anulación
      await prisma.refund.create({
        data: {
          transactionId: transaction.id,
          amount: data.amount,
          refundId: refundResponse.id,
          status: refundResponse.result.code === '000.000.000' ? 'COMPLETED' : 'PROCESSING',
          reason: data.reason,
        },
      });

      // Actualizar estado de transacción
      if (refundResponse.result.code === '000.000.000') {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'REFUNDED' },
        });
      }

      return refundResponse;
    } catch (error) {
      logger.error({ err: error }, 'Error en anulación');
      throw error;
    }
  }

  async verifyTransaction(paymentId: string) {
    try {
      const paymentData = await this.datafastService.verifyTransactionByPaymentId(paymentId);
      
      // Actualizar transacción si existe
      const transaction = await prisma.transaction.findFirst({
        where: { paymentId: paymentData.id },
      });

      if (transaction) {
        const status = this.mapStatus(paymentData.result.code);
        
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status,
            resultCode: paymentData.result.code,
            resultDescription: paymentData.result.description,
            responseCode: paymentData.resultDetails?.ResponseCode,
            authCode: paymentData.resultDetails?.AuthCode,
          },
        });
      }

      return paymentData;
    } catch (error) {
      logger.error({ err: error }, 'Error verificando transacción');
      throw error;
    }
  }

  private async saveToken(registrationId: string, customerId: string, paymentData: any) {
    try {
      // Extraer últimos 4 dígitos de la tarjeta si están disponibles
      const lastFourDigits = paymentData.resultDetails?.LastFourDigits || '****';
      const cardType = paymentData.resultDetails?.CardType || null;

      await prisma.token.create({
        data: {
          registrationId,
          customerId,
          lastFourDigits,
          cardType,
          expiryDate: paymentData.resultDetails?.ExpiryDate,
        },
      });

      logger.info(`✅ Token guardado: ${registrationId} para cliente ${customerId}`);
    } catch (error) {
      logger.error({ err: error }, 'Error guardando token');
    }
  }

  private mapStatus(code: string): PaymentStatus {
    if (code === '000.000.000') return 'SUCCESS';
    if (code.startsWith('000.')) return 'SUCCESS';
    if (code.startsWith('800.')) return 'FAILED';
    if (code.startsWith('100.')) return 'FAILED';
    if (code.startsWith('200.')) return 'FAILED';
    if (code.startsWith('700.')) return 'FAILED';
    if (code.startsWith('900.')) return 'FAILED';
    return 'FAILED';
  }
}