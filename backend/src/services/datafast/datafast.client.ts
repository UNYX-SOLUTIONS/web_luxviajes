import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { datafastConfig } from '../../config/datafast';
import { logger } from '../../config/logger';

export class DatafastClient {
  private client: AxiosInstance;
  private retryAttempts: number;

  constructor() {
    this.retryAttempts = datafastConfig.retryAttempts;

    this.client = axios.create({
      baseURL: datafastConfig.baseUrl,
      timeout: datafastConfig.timeout,
      headers: {
        'Authorization': `Bearer ${datafastConfig.bearerToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.client.interceptors.request.use((config) => {
      logger.info(`Datafast Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        logger.info(`Datafast Response: ${response.status} - ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        const errorData = error.response?.data || error.message;
        logger.error({ err: errorData }, 'Datafast Error');
        return Promise.reject(error);
      }
    );
  }

  private isRetryableError(error: AxiosError): boolean {
    if (!error.response) return true;
    const status = error.response.status;
    return status >= 500 || status === 429 || status === 408;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async post<T = any>(path: string, data: string, config?: AxiosRequestConfig): Promise<T> {
    let lastError: AxiosError | null = null;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.client.post<T>(path, data, config);
        return response.data;
      } catch (error) {
        lastError = error as AxiosError;
        if (attempt < this.retryAttempts && this.isRetryableError(lastError)) {
          const backoff = Math.min(1000 * Math.pow(2, attempt), 10000);
          logger.warn(`Reintentando POST ${path} en ${backoff}ms (intento ${attempt + 1}/${this.retryAttempts})`);
          await this.delay(backoff);
        } else {
          break;
        }
      }
    }

    throw lastError;
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
