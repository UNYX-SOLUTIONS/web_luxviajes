import { config } from 'dotenv';
config();

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

// Tipos de crédito
export const CreditTypes = {
  CORRIENTE: '00',
  DIFERIDO_CORRIENTE: '01',
  DIFERIDO_CON_INTERES: '02',
  DIFERIDO_SIN_INTERES: '03',
  DIFERIDO_CON_INTERES_GRACIA: '07',
  DIFERIDO_SIN_INTERES_GRACIA: '09',
  DIFERIDO_PLUS_CUOTAS: '21',
  DUPLICA_TU_PLAZO: '22',
} as const;

export type CreditType = typeof CreditTypes[keyof typeof CreditTypes];