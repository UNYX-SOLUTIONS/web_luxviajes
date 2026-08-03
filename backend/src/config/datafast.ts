import 'dotenv/config';

export interface DatafastConfig {
  entityId: string;
  bearerToken: string;
  baseUrl: string;
  merchantId: string;
  terminalId: string;
  shopperResultUrl: string;
  timeout: number;
  retryAttempts: number;
}

export const datafastConfig: DatafastConfig = {
  entityId: process.env.DATAFAST_ENTITY_ID!,
  bearerToken: process.env.DATAFAST_BEARER_TOKEN!,
  baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://eu-prod.oppwa.com'
    : 'https://eu-test.oppwa.com',
  merchantId: process.env.DATAFAST_MERCHANT_ID!,
  terminalId: process.env.DATAFAST_TERMINAL_ID!,
  shopperResultUrl: process.env.DATAFAST_SHOPPER_RESULT_URL!,
  timeout: parseInt(process.env.DATAFAST_TIMEOUT || '30000'),
  retryAttempts: parseInt(process.env.DATAFAST_RETRY_ATTEMPTS || '3'),
};

// Códigos de Datafast (fijos)
export const DATAFAST_CONSTANTS = {
  ECI: '0103910',
  PSERV: '17913101',
  VERSION: '2',
};