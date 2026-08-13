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

// ============================================
// INTERRUPTOR DE AMBIENTE
// En el .env: DATAFAST_ENV=test | production
// Cambia UNA palabra y todo lo demás se resuelve solo.
// ============================================
const DATAFAST_ENV = process.env.DATAFAST_ENV
  || (process.env.NODE_ENV === 'production' ? 'production' : 'test');
const IS_PRODUCTION = DATAFAST_ENV === 'production';

function readEnv(testKey: string, prodKey: string, required = false): string {
  const value = IS_PRODUCTION ? process.env[prodKey] : process.env[testKey];
  if (required && !value) {
    throw new Error(
      `Variable ${IS_PRODUCTION ? prodKey : testKey} requerida para DATAFAST_ENV=${DATAFAST_ENV}`
    );
  }
  return value || '';
}

function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const datafastConfig: DatafastConfig = {
  entityId: readEnv('DATAFAST_TEST_ENTITY_ID', 'DATAFAST_PROD_ENTITY_ID', true),
  bearerToken: readEnv('DATAFAST_TEST_BEARER_TOKEN', 'DATAFAST_PROD_BEARER_TOKEN', true),
  baseUrl: normalizeBaseUrl(
    readEnv('DATAFAST_TEST_BASE_URL', 'DATAFAST_PROD_BASE_URL', true)
  ),
  merchantId: readEnv('DATAFAST_TEST_MERCHANT_ID', 'DATAFAST_PROD_MERCHANT_ID', true),
  terminalId: readEnv('DATAFAST_TEST_TERMINAL_ID', 'DATAFAST_PROD_TERMINAL_ID', true),
  shopperResultUrl: readEnv(
    'DATAFAST_TEST_SHOPPER_RESULT_URL',
    'DATAFAST_PROD_SHOPPER_RESULT_URL',
    true
  ),
  timeout: parseInt(process.env.DATAFAST_TIMEOUT || '30000'),
  retryAttempts: parseInt(process.env.DATAFAST_RETRY_ATTEMPTS || '3'),
};

// testMode=EXTERNAL se envía SOLO en test (instrucción #2 de Datafast).
// En test se puede desactivar con DATAFAST_TEST_MODE=false.
export const DATAFAST_TEST_MODE_ENABLED =
  !IS_PRODUCTION && process.env.DATAFAST_TEST_MODE !== 'false';

// Códigos de Datafast (fijos)
export const DATAFAST_CONSTANTS = {
  ECI: '0103910',
  PSERV: '17913101',
  VERSION: '2',
};

// Reglas de tipos de crédito habilitados para el comercio
export interface CreditTypeRule {
  minAmount: number;
  maxInstallments: number;
  creditOnly: boolean;
}

export const CREDIT_TYPE_RULES: Record<string, CreditTypeRule> = {
  '00': { minAmount: 0.01, maxInstallments: 1, creditOnly: false },
  '02': { minAmount: 5.0, maxInstallments: 36, creditOnly: true },
  '03': { minAmount: 5.0, maxInstallments: 12, creditOnly: true },
};

export const ENABLED_CREDIT_TYPES = Object.keys(CREDIT_TYPE_RULES);
export const MIN_AMOUNT_DEFERRED = 5.0;
