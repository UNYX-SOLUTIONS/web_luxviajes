import { PaymentService } from '../../src/modules/payments/payment.service';
import { DatafastService } from '../../src/services/datafast/datafast.service';
import { prisma } from '../../src/config/database';

jest.mock('../../src/services/datafast/datafast.service');
jest.mock('../../src/config/database', () => ({
  prisma: {
    customer: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 'CUST_001' }),
      update: jest.fn().mockResolvedValue({ id: 'CUST_001' }),
      upsert: jest.fn().mockResolvedValue({ id: 'CUST_001' }),
    },
    transaction: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    refund: {
      create: jest.fn(),
    },
    token: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));

const MockedDatafastService = DatafastService as jest.MockedClass<typeof DatafastService>;

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockDatafast: jest.Mocked<DatafastService>;

  const mockTransaction = {
    id: 'txn-uuid-001',
    merchantTransactionId: 'TRX_123',
    checkoutId: 'checkout-abc',
    paymentId: null,
    amount: 150.0,
    currency: 'USD',
    paymentType: 'DB',
    status: 'PENDING',
    customerId: 'CUST_001',
    base0: 50.0,
    baseImp: 88.5,
    iva: 11.5,
    metadata: {},
  };

  const createCheckoutInput = {
    amount: 150.0,
    customer: {
      givenName: 'Juan',
      surname: 'Perez',
      ip: '127.0.0.1',
      merchantCustomerId: 'CUST_001',
      email: 'juan@test.com',
      identificationDocType: 'IDCARD',
      identificationDocId: '1712345678',
      phone: '0991234567',
    },
    billing: { street1: 'Av. Amazonas', country: 'EC' },
    taxes: { base0: 50.0, baseImp: 88.5, iva: 11.5 },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockDatafast = {
      createCheckout: jest.fn().mockResolvedValue({
        id: 'checkout-abc',
        result: { code: '000.200.100', description: 'OK' },
        timestamp: '2026-01-01T00:00:00Z',
        buildNumber: 'abc',
        ndc: 'ndc',
      }),
      getPaymentStatus: jest.fn(),
      refundTransaction: jest.fn(),
      verifyTransactionByPaymentId: jest.fn(),
      verifyTransactionByMerchantId: jest.fn(),
      createRecurringPayment: jest.fn(),
      deleteToken: jest.fn(),
    } as any;

    (MockedDatafastService as any).mockImplementation(() => mockDatafast);
    paymentService = new PaymentService();
  });

  describe('createCheckout', () => {
    it('should create a transaction in the database and call Datafast', async () => {
      (prisma.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);
      (prisma.transaction.update as jest.Mock).mockResolvedValue({
        ...mockTransaction,
        checkoutId: 'checkout-abc',
      });

      const result = await paymentService.createCheckout(createCheckoutInput);

      expect(prisma.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            merchantTransactionId: expect.stringMatching(/^TRX_/),
            amount: 150.0,
            status: 'PENDING',
          }),
        })
      );

      expect(mockDatafast.createCheckout).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        checkoutId: 'checkout-abc',
        transactionId: 'txn-uuid-001',
        merchantTransactionId: expect.any(String),
      });
    });

    it('should mark transaction as FAILED on Datafast error', async () => {
      (prisma.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);
      (prisma.transaction.update as jest.Mock).mockResolvedValue({ ...mockTransaction, status: 'FAILED' });
      mockDatafast.createCheckout.mockRejectedValue(new Error('API Error'));

      await expect(paymentService.createCheckout(createCheckoutInput)).rejects.toThrow('API Error');

      expect(prisma.transaction.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'FAILED',
            errorDetails: expect.any(Object),
          }),
        })
      );
    });
  });

  describe('getPaymentStatus', () => {
    const paymentStatusResponse = {
      id: 'payment-123',
      paymentType: 'DB',
      amount: '150.00',
      currency: 'USD',
      result: { code: '000.000.000', description: 'Aprobada' },
      registrationId: 'reg-token-abc',
      resultDetails: {
        ResponseCode: '00',
        AuthCode: '123456',
        LastFourDigits: '1234',
        CardType: 'VI',
      },
      merchantTransactionId: 'TRX_123',
      timestamp: '2026-01-01T00:00:00Z',
      ndc: 'ndc',
      buildNumber: 'abc',
    };

    it('should update transaction status on successful payment', async () => {
      mockDatafast.getPaymentStatus.mockResolvedValue(paymentStatusResponse);
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(mockTransaction);
      (prisma.transaction.update as jest.Mock).mockResolvedValue({
        ...mockTransaction,
        status: 'SUCCESS',
        paymentId: 'payment-123',
      });
      (prisma.token.upsert as jest.Mock).mockResolvedValue({});

      const result = await paymentService.getPaymentStatus('/v1/checkouts/payment-123/payment');

      expect(result.result.code).toBe('000.000.000');
      expect(prisma.transaction.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'SUCCESS',
            paymentId: 'payment-123',
          }),
        })
      );
    });

    it('should save token when transaction succeeds and registrationId exists', async () => {
      mockDatafast.getPaymentStatus.mockResolvedValue(paymentStatusResponse);
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(mockTransaction);
      (prisma.transaction.update as jest.Mock).mockResolvedValue({});
      (prisma.token.upsert as jest.Mock).mockResolvedValue({});

      await paymentService.getPaymentStatus('/v1/checkouts/payment-123/payment');

      expect(prisma.token.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { registrationId: 'reg-token-abc' },
          create: expect.objectContaining({
            registrationId: 'reg-token-abc',
            lastFourDigits: '1234',
            cardType: 'VI',
          }),
          update: expect.objectContaining({
            isActive: true,
          }),
        })
      );
    });
  });

  describe('refundTransaction', () => {
    it('should reject refund for non-successful transaction', async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue({
        ...mockTransaction,
        status: 'PENDING',
      });

      await expect(
        paymentService.refundTransaction({
          transactionId: 'txn-001',
          amount: 150.0,
        })
      ).rejects.toThrow('Solo se pueden anular transacciones exitosas');
    });

    it('should reject refund for transaction without paymentId', async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue({
        ...mockTransaction,
        status: 'SUCCESS',
        paymentId: null,
      });

      await expect(
        paymentService.refundTransaction({
          transactionId: 'txn-001',
          amount: 150.0,
        })
      ).rejects.toThrow('La transacción no tiene paymentId');
    });

    it('should process refund successfully', async () => {
      const successTransaction = {
        ...mockTransaction,
        status: 'SUCCESS',
        paymentId: 'payment-123',
      };

      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(successTransaction);
      mockDatafast.refundTransaction.mockResolvedValue({
        id: 'refund-456',
        paymentType: 'RF',
        amount: '150.00',
        currency: 'USD',
        result: { code: '000.000.000', description: 'OK' },
        timestamp: '2026-01-01T00:00:00Z',
        ndc: 'ndc',
        buildNumber: 'abc',
      });
      (prisma.refund.create as jest.Mock).mockResolvedValue({});
      (prisma.transaction.update as jest.Mock).mockResolvedValue({});

      const result = await paymentService.refundTransaction({
        transactionId: 'txn-001',
        amount: 150.0,
      });

      expect(result.id).toBe('refund-456');
      expect(prisma.refund.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'COMPLETED',
            amount: 150.0,
          }),
        })
      );
    });
  });

  describe('createRecurringPayment', () => {
    it('should reject if token is not found', async () => {
      (prisma.token.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        paymentService.createRecurringPayment({
          tokenId: 'nonexistent',
          amount: 100.0,
          taxes: { base0: 0, baseImp: 88.5, iva: 11.5 },
        })
      ).rejects.toThrow('Token no encontrado');
    });

    it('should reject if token is inactive', async () => {
      (prisma.token.findUnique as jest.Mock).mockResolvedValue({
        id: 'token-001',
        registrationId: 'reg-abc',
        customerId: 'CUST_001',
        isActive: false,
      });

      await expect(
        paymentService.createRecurringPayment({
          tokenId: 'token-001',
          amount: 100.0,
          taxes: { base0: 0, baseImp: 88.5, iva: 11.5 },
        })
      ).rejects.toThrow('Token inactivo');
    });

    it('should process recurring payment successfully', async () => {
      (prisma.token.findUnique as jest.Mock).mockResolvedValue({
        id: 'token-001',
        registrationId: 'reg-abc',
        customerId: 'CUST_001',
        isActive: true,
      });
      (prisma.transaction.create as jest.Mock).mockResolvedValue({
        ...mockTransaction,
        id: 'recurring-txn-001',
      });
      (prisma.transaction.update as jest.Mock).mockResolvedValue({});
      mockDatafast.createRecurringPayment.mockResolvedValue({
        id: 'rec-payment-789',
        paymentType: 'DB',
        amount: '100.00',
        currency: 'USD',
        result: { code: '000.000.000', description: 'Aprobada' },
        resultDetails: {
          ResponseCode: '00',
          AuthCode: '789012',
        },
        timestamp: '2026-01-01T00:00:00Z',
        ndc: 'ndc',
        buildNumber: 'abc',
      });

      const result = await paymentService.createRecurringPayment({
        tokenId: 'token-001',
        amount: 100.0,
        taxes: { base0: 0, baseImp: 88.5, iva: 11.5 },
      });

      expect(result.id).toBe('rec-payment-789');
      expect(mockDatafast.createRecurringPayment).toHaveBeenCalledWith(
        'reg-abc',
        expect.any(Object)
      );
    });
  });

  describe('deleteToken', () => {
    it('should delete token via Datafast and mark as inactive', async () => {
      (prisma.token.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      const result = await paymentService.deleteToken('reg-abc');

      expect(mockDatafast.deleteToken).toHaveBeenCalledWith('reg-abc');
      expect(prisma.token.updateMany).toHaveBeenCalledWith({
        where: { registrationId: 'reg-abc' },
        data: { isActive: false },
      });
      expect(result).toEqual({ success: true });
    });
  });
});
