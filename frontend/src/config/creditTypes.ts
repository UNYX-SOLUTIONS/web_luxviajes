export type CardClass = "CREDIT" | "DEBIT";

export interface CreditTypeConfig {
  code: string;
  label: string;
  cardClass: "CREDIT_AND_DEBIT" | "CREDIT_ONLY";
  minAmount: number;
  maxInstallments: number;
  hasInterest: boolean;
}

export const CREDIT_TYPE_CONFIG: Record<string, CreditTypeConfig> = {
  "00": {
    code: "00",
    label: "Corriente",
    cardClass: "CREDIT_AND_DEBIT",
    minAmount: 0.01,
    maxInstallments: 1,
    hasInterest: false,
  },
  "02": {
    code: "02",
    label: "Diferido con interés",
    cardClass: "CREDIT_ONLY",
    minAmount: 5.0,
    maxInstallments: 36,
    hasInterest: true,
  },
  "03": {
    code: "03",
    label: "Diferido sin interés",
    cardClass: "CREDIT_ONLY",
    minAmount: 5.0,
    maxInstallments: 12,
    hasInterest: false,
  },
};

export const MIN_AMOUNT_DEFERRED = 5.0;

export const INSTALLMENT_OPTIONS: Record<string, number[]> = {
  "02": [2, 3, 6, 9, 12, 18, 24, 36],
  "03": [2, 3, 6, 9, 12],
};

export function getEnabledCreditTypes(
  amount: number,
  cardClass: CardClass,
): CreditTypeConfig[] {
  return Object.values(CREDIT_TYPE_CONFIG).filter(
    (t) =>
      amount >= t.minAmount &&
      (cardClass === "CREDIT" || t.cardClass === "CREDIT_AND_DEBIT"),
  );
}

export function getInstallmentOptions(creditType: string): number[] {
  const config = CREDIT_TYPE_CONFIG[creditType];
  if (!config || config.maxInstallments <= 1) return [];
  return (INSTALLMENT_OPTIONS[creditType] || []).filter(
    (n) => n <= config.maxInstallments,
  );
}

export const ERROR_MESSAGES = {
  DEBIT_DEFERRED:
    "Las tarjetas de débito no permiten pagos en cuotas. Selecciona 'Pago corriente'.",
  MIN_AMOUNT:
    "El monto mínimo para pagar en cuotas es $5.00.",
  TYPE_NOT_ENABLED:
    "Este tipo de crédito no está disponible para este servicio.",
  INSTALLMENTS_REQUIRED: "Selecciona el número de cuotas.",
} as const;
