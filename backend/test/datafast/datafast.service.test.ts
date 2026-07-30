import { DatafastService } from '../../src/services/datafast/datafast.service';
import { DatafastClient } from '../../src/services/datafast/datafast.client';
import { ICreateCheckoutRequest, ITokenPaymentRequest, IPaymentStatusResponse, IRefundResponse } from '../../src/services/datafast/types/datafast.types';

jest.mock('../../src/services/datafast/datafast.client');
jest.mock('../../src/config/datafast', () => ({
  datafastConfig: {
    entityId: 'mock-entity-id',
    bearerToken: 'mock-bearer-token',
    baseUrl: 'https://test.oppwa.com',
    merchantId: '1000000406',
    terminalId: 'PD100406',
    shopperResultUrl: 'https://test.com/result',
    timeout: 30000,
    retryAttempts: 3,
  },
  DATAFAST_CONSTANTS: {
    ECI: '0103910',
    PSERV: '17913101',
    VERSION: '2',
  },
  CreditTypes: {
    CORRIENTE: '00',
  },
}));

const MockedClient = DatafastClient as jest.MockedClass<typeof DatafastClient>;

describe('DatafastService', () => {
  let service: DatafastService;
  let mockClient: jest.Mocked<DatafastClient>;

  const mockCheckoutRequest: ICreateCheckoutRequest = {
    amount: 150.0,
    merchantTransactionId: 'TRX_test_123',
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
    billing: {
      street1: 'Av. Amazonas 123',
      country: 'EC',
    },
    taxes: {
      base0: 50.0,
      baseImp: 88.5,
      iva: 11.5,
    },
    items: [
      { name: 'Tour Galapagos', price: 150.0, quantity: 1 },
    ],
  };

  const mockCheckoutResponse = {
    id: 'checkout-id-123',
    result: { code: '000.200.100', description: 'Checkout creado exitosamente' },
    timestamp: '2026-01-01T00:00:00Z',
    buildNumber: 'abc123',
    ndc: 'ndc123',
  };

  const mockPaymentStatus: IPaymentStatusResponse = {
    id: 'payment-123',
    paymentType: 'DB',
    amount: '150.00',
    currency: 'USD',
    result: { code: '000.000.000', description: 'Transacción aprobada' },
    resultDetails: {
      ResponseCode: '00',
      AuthCode: '123456',
      AcquirerCode: '01',
      clearingInstituteName: 'Banco Pacifico',
      LastFourDigits: '1234',
      CardType: 'VI',
      ExpiryDate: '12/28',
    },
    registrationId: 'reg-token-abc',
    merchantTransactionId: 'TRX_test_123',
    timestamp: '2026-01-01T00:00:00Z',
    ndc: 'ndc123',
    buildNumber: 'abc123',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockClient = {
      post: jest.fn().mockResolvedValue(mockCheckoutResponse),
      get: jest.fn().mockResolvedValue(mockPaymentStatus),
      delete: jest.fn().mockResolvedValue(undefined),
      put: jest.fn(),
    } as any;

    (MockedClient as any).mockImplementation(() => mockClient);
    service = new DatafastService();
  });

  describe('createCheckout', () => {
    it('should create a checkout with all required parameters', async () => {
      const result = await service.createCheckout(mockCheckoutRequest);

      expect(result.id).toBe('checkout-id-123');
      expect(mockClient.post).toHaveBeenCalledTimes(1);

      const [url, params] = mockClient.post.mock.calls[0];
      expect(url).toBe('/v1/checkouts');
      expect(params).toContain('entityId=');
      expect(params).toContain('amount=150.00');
      expect(params).toContain('currency=USD');
      expect(params).toContain('paymentType=DB');
      expect(params).toContain('customer.givenName=Juan');
      expect(params).toContain('customer.surname=Perez');
    });

    it('should include customParameters with tax data', async () => {
      await service.createCheckout(mockCheckoutRequest);

      const [, params] = mockClient.post.mock.calls[0];
      expect(params).toContain('customParameters%5BSHOPPER_VAL_BASE0%5D=50.00');
      expect(params).toContain('customParameters%5BSHOPPER_VAL_BASEIMP%5D=88.50');
      expect(params).toContain('customParameters%5BSHOPPER_VAL_IVA%5D=11.50');
    });

    it('should propagate errors from the client', async () => {
      mockClient.post.mockRejectedValue(new Error('Network error'));

      await expect(service.createCheckout(mockCheckoutRequest)).rejects.toThrow('Network error');
    });

    it('should include cart items when provided', async () => {
      await service.createCheckout(mockCheckoutRequest);

      const [, params] = mockClient.post.mock.calls[0];
      expect(params).toContain('cart.items%5B0%5D.name');
      expect(params).toContain('Tour+Galapagos');
    });

    it('should enable test mode in non-production', async () => {
      process.env.NODE_ENV = 'development';

      await service.createCheckout(mockCheckoutRequest);

      const [, params] = mockClient.post.mock.calls[0];
      expect(params).toContain('testMode=EXTERNAL');
    });
  });

  describe('getPaymentStatus', () => {
    it('should get payment status by resource path', async () => {
      const result = await service.getPaymentStatus('/v1/checkouts/payment-123/payment');

      expect(result.result.code).toBe('000.000.000');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/checkouts/payment-123/payment',
        { entityId: expect.any(String) }
      );
    });
  });

  describe('createRecurringPayment', () => {
    const tokenPaymentRequest: ITokenPaymentRequest = {
      amount: 75.0,
      merchantTransactionId: 'REC_test_456',
      taxes: { base0: 25.0, baseImp: 44.25, iva: 5.75 },
    };

    const tokenPaymentResponse = {
      id: 'rec-payment-789',
      paymentType: 'DB',
      amount: '75.00',
      currency: 'USD',
      result: { code: '000.000.000', description: 'Transacción aprobada' },
      resultDetails: {
        ResponseCode: '00',
        AuthCode: '789012',
      },
      timestamp: '2026-01-01T00:00:00Z',
      ndc: 'ndc123',
      buildNumber: 'abc123',
    };

    it('should create a recurring payment with token', async () => {
      mockClient.post.mockResolvedValue(tokenPaymentResponse);

      const result = await service.createRecurringPayment('reg-token-abc', tokenPaymentRequest);

      expect(result.id).toBe('rec-payment-789');
      const [url, params] = mockClient.post.mock.calls[0];
      expect(url).toBe('/v1/registrations/reg-token-abc/payments');
      expect(params).toContain('recurringType=REPEATED');
      expect(params).toContain('risk.parameters%5BUSER_DATA1%5D=REPEATED');
    });
  });

  describe('refundTransaction', () => {
    const refundResponse: IRefundResponse = {
      id: 'refund-456',
      paymentType: 'RF',
      amount: '75.00',
      currency: 'USD',
      result: { code: '000.000.000', description: 'Anulación exitosa' },
      timestamp: '2026-01-01T00:00:00Z',
      ndc: 'ndc123',
      buildNumber: 'abc123',
    };

    it('should refund a transaction', async () => {
      mockClient.post.mockResolvedValue(refundResponse);

      const result = await service.refundTransaction('payment-123', {
        amount: 75.0,
        merchantTransactionId: 'RF_test_789',
      });

      expect(result.id).toBe('refund-456');
      const [url, params] = mockClient.post.mock.calls[0];
      expect(url).toBe('/v1/payments/payment-123');
      expect(params).toContain('paymentType=RF');
    });
  });

  describe('deleteToken', () => {
    it('should delete a token registration', async () => {
      await service.deleteToken('reg-token-abc');

      expect(mockClient.delete).toHaveBeenCalledWith('/v1/registrations/reg-token-abc');
    });
  });

  describe('verifyTransactionByPaymentId', () => {
    it('should verify a transaction by payment ID', async () => {
      const result = await service.verifyTransactionByPaymentId('payment-123');

      expect(result.result.code).toBe('000.000.000');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/query/payment-123',
        { entityId: expect.any(String) }
      );
    });
  });
});
