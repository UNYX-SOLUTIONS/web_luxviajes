import axios from 'axios';
import { DatafastClient } from '../../src/services/datafast/datafast.client';
import { datafastConfig } from '../../src/config/datafast';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

function createMockAxiosInstance() {
  return {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
    },
  };
}

describe('DatafastClient', () => {
  let client: DatafastClient;
  let mockInstance: ReturnType<typeof createMockAxiosInstance>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockInstance = createMockAxiosInstance();
    mockedAxios.create.mockReturnValue(mockInstance as any);
    client = new DatafastClient();
  });

  describe('POST', () => {
    it('should make a successful POST request', async () => {
      const mockResponse = { data: { id: 'checkout-123', result: { code: '000.200.100' } } };
      mockInstance.post.mockResolvedValue(mockResponse);

      const result = await client.post('/v1/checkouts', 'entityId=test&amount=10.00');

      expect(result).toEqual(mockResponse.data);
    });

    it('should use correct base URL and headers', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: datafastConfig.baseUrl,
          timeout: datafastConfig.timeout,
          headers: expect.objectContaining({
            'Authorization': `Bearer ${datafastConfig.bearerToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        })
      );
    });
  });

  describe('GET', () => {
    it('should make a GET request with params', async () => {
      const mockResponse = { data: { id: 'payment-123', result: { code: '000.000.000' } } };
      mockInstance.get.mockResolvedValue(mockResponse);

      const result = await client.get('/v1/query/123', { entityId: 'test' });

      expect(result).toEqual(mockResponse.data);
      expect(mockInstance.get).toHaveBeenCalledWith('/v1/query/123', { params: { entityId: 'test' } });
    });
  });

  describe('DELETE', () => {
    it('should make a DELETE request', async () => {
      const mockResponse = { data: { result: { code: '000.000.000' } } };
      mockInstance.delete.mockResolvedValue(mockResponse);

      const result = await client.delete('/v1/registrations/token123');

      expect(result).toEqual(mockResponse.data);
    });
  });
});
