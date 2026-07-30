import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { datafastConfig } from '../../config/datafast';
import { logger } from '../../config/logger';

export class DatafastClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: datafastConfig.baseUrl,
      timeout: datafastConfig.timeout,
      headers: {
        'Authorization': `Bearer ${datafastConfig.bearerToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Interceptor para logging
    this.client.interceptors.request.use((config) => {
      logger.info(`📤 Datafast Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        logger.info(`📥 Datafast Response: ${response.status} - ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('❌ Datafast Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async post<T = any>(path: string, data: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(path, data, config);
    return response.data;
  }

  async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(path, { params });
    return response.data;
  }

  async delete<T = any>(path: string): Promise<T> {
    const response = await this.client.delete<T>(path);
    return response.data;
  }

  async put<T = any>(path: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(path, data);
    return response.data;
  }
}