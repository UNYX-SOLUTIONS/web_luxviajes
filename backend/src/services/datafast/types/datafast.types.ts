// ============================================
// TIPOS DE SOLICITUDES (REQUEST)
// ============================================

/**
 * Datos del cliente para la transacción
 */
export interface ICustomerData {
  givenName: string;              // Nombre (3-48 caracteres)
  middleName?: string;            // Segundo nombre (2-50 caracteres)
  surname: string;                // Apellido (3-48 caracteres)
  ip: string;                     // Dirección IP del cliente
  merchantCustomerId: string;     // ID del cliente en el comercio
  email: string;                  // Correo electrónico
  identificationDocType?: string; // Tipo de documento (IDCARD, PASSPORT, etc.)
  identificationDocId: string;    // Número de documento (10 caracteres)
  phone: string;                  // Teléfono (7-25 caracteres)
}

/**
 * Datos de facturación
 */
export interface IBillingData {
  street1: string;               // Dirección (1-100 caracteres)
  country: string;               // País (ISO 3166-1, ej: EC, US, CL)
}

/**
 * Datos de envío
 */
export interface IShippingData {
  street1?: string;              // Dirección de entrega (1-100 caracteres)
  country?: string;              // País de entrega (ISO 3166-1)
}

/**
 * Datos de impuestos (obligatorios)
 */
export interface ITaxData {
  base0: number;                 // % Base 0 (sin impuesto)
  baseImp: number;               // % Base imponible (con impuesto)
  iva: number;                   // Valor del IVA calculado
}

/**
 * Ítem del carrito de compras
 */
export interface ICartItem {
  name: string;                  // Nombre del producto (1-255 caracteres)
  description?: string;          // Descripción del producto (1-255 caracteres)
  price: number;                 // Precio (formato: #####.##)
  quantity: number;              // Cantidad (1-12, con hasta 3 decimales)
}

/**
 * Registro para OneClickCheckout
 */
export interface IRegistration {
  id: string;                    // ID del token registrado
}

/**
 * Solicitud para crear un checkout
 */
export interface ICreateCheckoutRequest {
  // Datos obligatorios
  amount: number;                // Monto total de la transacción
  merchantTransactionId: string; // ID único de transacción del comercio
  customer: ICustomerData;       // Datos del cliente
  billing: IBillingData;         // Datos de facturación
  taxes: ITaxData;               // Datos de impuestos
  
  // Datos opcionales
  shipping?: IShippingData;      // Datos de envío
  items?: ICartItem[];           // Productos del carrito
  creditType?: string;           // Tipo de crédito (00, 01, 02, etc.)
  installments?: number;         // Número de cuotas (0-36)
  createRegistration?: boolean;  // Tokenizar tarjeta
  registrations?: IRegistration[]; // Tokens existentes para OneClick
  recurringType?: string;        // Tipo de recurrencia (REPEATED, etc.)
}

/**
 * Solicitud para pago con token (recurrente)
 */
export interface ITokenPaymentRequest {
  amount: number;                // Monto de la transacción
  merchantTransactionId: string; // ID único de transacción del comercio
  taxes: ITaxData;               // Datos de impuestos
  recurringType?: string;        // Tipo de recurrencia (REPEATED)
}

/**
 * Solicitud para anulación (refund)
 */
export interface IRefundRequest {
  amount: number;                // Monto a anular
  merchantTransactionId?: string; // ID único de transacción del comercio
}

/**
 * Solicitud para verificar transacción
 */
export interface IVerifyTransactionRequest {
  entityId: string;              // ID de la entidad
  merchantTransactionId?: string; // ID de transacción del comercio
  paymentId?: string;            // ID de pago de Datafast
}

// ============================================
// TIPOS DE RESPUESTAS (RESPONSE)
// ============================================

/**
 * Resultado de la transacción
 */
export interface IResult {
  code: string;                  // Código de resultado
  description: string;           // Descripción del resultado
}

/**
 * Detalles del resultado de la transacción
 */
export interface IResultDetails {
  ExtendedDescription?: string;  // Descripción extendida
  RiskStatusCode?: string;       // Código de riesgo
  ResponseCode?: string;         // Código de respuesta del banco
  AuthCode?: string;             // Código de autorización
  AcquirerResponse?: string;     // Respuesta del adquiriente
  AcquirerCode?: string;         // Código del adquiriente
  clearingInstituteName?: string; // Nombre del banco adquirente
  ReferenceNbr?: string;         // Número de referencia
  OrderId?: string;              // ID de la orden
  ConnectorTxID1?: string;       // ID de transacción del conector
  CardType?: string;             // Tipo de tarjeta (DC, PM, VI, etc.)
  LastFourDigits?: string;       // Últimos 4 dígitos de la tarjeta
  ExpiryDate?: string;           // Fecha de expiración (MM/YY)
}

/**
 * Datos de riesgo
 */
export interface IRiskData {
  score: string;                 // Puntuación de riesgo
}

/**
 * Respuesta de creación de checkout
 */
export interface ICreateCheckoutResponse {
  id: string;                    // Checkout ID (para el formulario)
  result: IResult;               // Resultado de la operación
  timestamp: string;             // Timestamp de la respuesta
  buildNumber: string;           // Número de build
  ndc: string;                   // NDC de la transacción
}

/**
 * Respuesta de estado de pago
 */
export interface IPaymentStatusResponse {
  id: string;                    // Payment ID
  paymentType: string;           // Tipo de pago (DB, RF, etc.)
  amount: string;                // Monto
  currency: string;              // Moneda
  description?: string;          // Descripción
  result: IResult;               // Resultado de la transacción
  resultDetails?: IResultDetails; // Detalles del resultado
  customParameters?: Record<string, any>; // Parámetros personalizados
  risk?: IRiskData;              // Datos de riesgo
  merchantTransactionId?: string; // ID de transacción del comercio
  registrationId?: string;       // ID de registro (token)
  timestamp: string;             // Timestamp de la respuesta
  ndc: string;                   // NDC de la transacción
  buildNumber: string;           // Número de build
  // Campos adicionales para recurrencia
  recurringType?: string;        // Tipo de recurrencia
}

/**
 * Respuesta de pago con token (recurrente)
 */
export interface ITokenPaymentResponse {
  id: string;                    // Payment ID
  paymentType: string;           // Tipo de pago (DB)
  amount: string;                // Monto
  currency: string;              // Moneda
  result: IResult;               // Resultado de la transacción
  resultDetails: {
    ResponseCode: string;        // Código de respuesta del banco
    AuthCode: string;            // Código de autorización
    ExtendedDescription?: string; // Descripción extendida
    AcquirerCode?: string;       // Código del adquiriente
    clearingInstituteName?: string; // Nombre del banco
  };
  timestamp: string;             // Timestamp de la respuesta
  ndc: string;                   // NDC de la transacción
  buildNumber: string;           // Número de build
}

/**
 * Respuesta de anulación (refund)
 */
export interface IRefundResponse {
  id: string;                    // Refund ID
  paymentType: string;           // Tipo de pago (RF)
  amount: string;                // Monto
  currency: string;              // Moneda
  result: IResult;               // Resultado de la transacción
  resultDetails?: {
    ResponseCode?: string;       // Código de respuesta
    AuthCode?: string;           // Código de autorización
  };
  timestamp: string;             // Timestamp de la respuesta
  ndc: string;                   // NDC de la transacción
  buildNumber: string;           // Número de build
}

/**
 * Respuesta de eliminación de token
 */
export interface IDeleteTokenResponse {
  result: IResult;               // Resultado de la operación
  timestamp: string;             // Timestamp de la respuesta
  ndc: string;                   // NDC de la transacción
  buildNumber: string;           // Número de build
}

// ============================================
// ENUMS Y CONSTANTES
// ============================================

/**
 * Tipos de pago
 */
export enum PaymentType {
  DB = 'DB',                     // Débito/Débito (compra)
  RF = 'RF',                     // Reembolso/Anulación
  CP = 'CP',                     // Captura parcial
  PA = 'PA',                     // Pre-autorización
}

/**
 * Estado de la transacción (mapeado)
 */
export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
  REVERSED = 'REVERSED',
}

/**
 * Tipos de crédito (SHOPPER_TIPOCREDITO)
 */
export enum CreditType {
  CORRIENTE = '00',              // Transacción corriente
  DIFERIDO_CORRIENTE = '01',     // Diferido corriente
  DIFERIDO_CON_INTERES = '02',   // Diferido con interés
  DIFERIDO_SIN_INTERES = '03',   // Diferido sin interés
  DIFERIDO_CON_INTERES_GRACIA = '07', // Diferido con interés + meses de gracia
  DIFERIDO_SIN_INTERES_GRACIA = '09', // Diferido sin interés + meses de gracia
  DIFERIDO_PLUS_CUOTAS = '21',   // Diferido Plus cuotas
  DUPLICA_TU_PLAZO = '22',       // Duplica tu plazo
}

/**
 * Tipos de documento de identidad
 */
export enum IdentificationDocType {
  IDCARD = 'IDCARD',             // Cédula de identidad
  PASSPORT = 'PASSPORT',         // Pasaporte
  RUC = 'RUC',                   // RUC (solo 10 dígitos)
  DNI = 'DNI',                   // DNI (Perú)
  CE = 'CE',                     // Cédula de extranjería
}

/**
 * Códigos de bancos adquirentes
 */
export enum AcquirerCode {
  PACIFICADOR = '01',
  DINERS = '02',
  PICHINCHA = '03',
  BANCO_GUAYAQUIL = '04',
  SOLIDARIO = '06',
  MEDIANET = '07',
  BANCO_AUSTRO = '08',
  COOP_29_OCTUBRE = '09',
}

/**
 * Códigos de tarjetas
 */
export enum CardType {
  DC = 'DC',                     // Diners
  PM = 'PM',                     // Mastercard Pacífico
  MI = 'MI',                     // Mastercard Internacional
  PV = 'PV',                     // Visa Pacífico
  VI = 'VI',                     // Visa Internacional
  VP = 'VP',                     // Visa Pichincha
  BG = 'BG',                     // American Express (Banco Guayaquil)
  VG = 'VG',                     // Visa Banco Guayaquil
  MG = 'MG',                     // Mastercard Banco Guayaquil
  DG = 'DG',                     // Débito Banco Guayaquil
  DP = 'DP',                     // Débito Pacíficard
  MP = 'MP',                     // Mastercard Pichincha
  DI = 'DI',                     // Discover
  CO = 'CO',                     // Coop. 29 de Octubre
  VM = 'VM',                     // Visa Medianet
  VA = 'VA',                     // Visa Banco del Austro
  MM = 'MM',                     // Mastercard Medianet
  MA = 'MA',                     // Mastercard Banco del Austro
  CS = 'CS',                     // Crédito Solidario
  DS = 'DS',                     // Débito Solidario
  UP = 'UP',                     // Unión Pay
}

// ============================================
// TIPOS DE ERRORES
// ============================================

/**
 * Error de Datafast
 */
export interface IDatafastError {
  result: {
    code: string;
    description: string;
  };
  timestamp: string;
  ndc: string;
  buildNumber: string;
  errors?: {
    field?: string;
    message: string;
  }[];
}

/**
 * Mapeo de códigos de respuesta del banco
 */
export interface IBankResponseCodes {
  [key: string]: {
    description: string;
    action: string;
  };
}

export const BankResponseCodes: IBankResponseCodes = {
  '00': { description: 'Transacción aprobada', action: 'success' },
  '02': { description: 'Problema con la tarjeta - Llame al Centro de Autorización', action: 'call_bank' },
  '03': { description: 'Establecimiento inválido', action: 'contact_datafast' },
  '04': { description: 'Retenga la tarjeta y llame', action: 'call_bank' },
  '05': { description: 'Transacción rechazada - Motivo no especificado', action: 'call_bank' },
  '07': { description: 'Retenga la tarjeta y llame', action: 'call_bank' },
  '12': { description: 'Transacción inválida', action: 'error' },
  '13': { description: 'Monto inválido', action: 'error' },
  '14': { description: 'Error en el número de tarjeta', action: 'error' },
  '15': { description: 'Error en el número de tarjeta', action: 'error' },
  '17': { description: 'Socio cancelado', action: 'error' },
  '19': { description: 'Transacción rechazada - Reintente', action: 'retry' },
  '41': { description: 'Tarjeta pérdida - Retenga y llame', action: 'call_bank' },
  '43': { description: 'Tarjeta robada - Retenga y llame', action: 'call_bank' },
  '51': { description: 'Fondos insuficientes', action: 'error' },
  '54': { description: 'Tarjeta expirada', action: 'error' },
  '57': { description: 'Transacción no permitida', action: 'error' },
  '61': { description: 'Monto excede el crédito disponible', action: 'error' },
  '62': { description: 'Tarjeta restringida', action: 'error' },
  '76': { description: 'Cuenta inválida', action: 'error' },
  '77': { description: 'Modalidad inválida', action: 'error' },
  '79': { description: 'Fecha de caducidad errada', action: 'error' },
  '80': { description: 'Establecimiento cancelado', action: 'error' },
  '84': { description: 'Problema con la tarjeta - Llame al Centro de Autorización', action: 'call_bank' },
  '88': { description: 'Transacción rechazada - Reintente', action: 'retry' },
  '89': { description: 'Terminal inválida', action: 'contact_datafast' },
  '91': { description: 'Entidad fuera de línea', action: 'retry' },
};

// ============================================
// TIPOS DE RESPUESTAS DE WEBHOOKS
// ============================================

/**
 * Webhook de Datafast (si se implementa)
 */
export interface IDatafastWebhook {
  id: string;
  paymentType: string;
  amount: string;
  currency: string;
  result: IResult;
  resultDetails?: IResultDetails;
  merchantTransactionId?: string;
  timestamp: string;
  ndc: string;
  buildNumber: string;
}

// ============================================
// TIPOS DE UTILIDADES
// ============================================

/**
 * Estado de la transacción con descripción amigable
 */
export interface ITransactionStatusInfo {
  code: string;
  description: string;
  isSuccess: boolean;
  isPending: boolean;
  isFailed: boolean;
  userMessage: string;
}

/**
 * Configuración de tipos de crédito para mostrar en UI
 */
export interface ICreditTypeOption {
  value: CreditType;
  label: string;
  description: string;
  installmentsAllowed: boolean;
  minInstallments: number;
  maxInstallments: number;
}

export const CreditTypeOptions: ICreditTypeOption[] = [
  {
    value: CreditType.CORRIENTE,
    label: 'Corriente',
    description: 'Pago total sin intereses',
    installmentsAllowed: false,
    minInstallments: 0,
    maxInstallments: 0,
  },
  {
    value: CreditType.DIFERIDO_CON_INTERES,
    label: 'Diferido con interés',
    description: 'Pago en cuotas con intereses',
    installmentsAllowed: true,
    minInstallments: 2,
    maxInstallments: 36,
  },
  {
    value: CreditType.DIFERIDO_SIN_INTERES,
    label: 'Diferido sin interés',
    description: 'Pago en cuotas sin intereses',
    installmentsAllowed: true,
    minInstallments: 2,
    maxInstallments: 12,
  },
  {
    value: CreditType.DUPLICA_TU_PLAZO,
    label: 'Duplica tu plazo',
    description: 'Duplica el plazo de tu compra',
    installmentsAllowed: true,
    minInstallments: 2,
    maxInstallments: 24,
  },
];

// ============================================
// TIPOS DE CONFIGURACIÓN
// ============================================

/**
 * Configuración de Datafast
 */
export interface IDatafastConfig {
  entityId: string;
  bearerToken: string;
  baseUrl: string;
  merchantId: string;
  terminalId: string;
  shopperResultUrl: string;
  timeout: number;
  retryAttempts: number;
}

/**
 * Constantes de Datafast (valores fijos)
 */
export interface IDatafastConstants {
  ECI: string;
  PSERV: string;
  VERSION: string;
  CURRENCY: string;
  PAYMENT_TYPE: string;
  COUNTRY: string;
}

// ============================================
// TIPOS DE MAPEO PARA STATUS
// ============================================

export type StatusMapper = {
  [key: string]: {
    status: TransactionStatus;
    userMessage: string;
    isFinal: boolean;
  };
};

export const StatusMapper: StatusMapper = {
  '000.000.000': {
    status: TransactionStatus.SUCCESS,
    userMessage: 'Transacción aprobada exitosamente',
    isFinal: true,
  },
  '000.100.110': {
    status: TransactionStatus.SUCCESS,
    userMessage: 'Transacción aprobada en modo de pruebas',
    isFinal: true,
  },
  '000.100.112': {
    status: TransactionStatus.SUCCESS,
    userMessage: 'Transacción aprobada en modo de pruebas',
    isFinal: true,
  },
  '000.200.100': {
    status: TransactionStatus.PROCESSING,
    userMessage: 'Checkout creado exitosamente',
    isFinal: false,
  },
  '800.100.100': {
    status: TransactionStatus.FAILED,
    userMessage: 'Transacción rechazada - Motivo desconocido',
    isFinal: true,
  },
  '800.100.151': {
    status: TransactionStatus.FAILED,
    userMessage: 'Tarjeta inválida',
    isFinal: true,
  },
  '800.100.152': {
    status: TransactionStatus.FAILED,
    userMessage: 'Transacción rechazada por el banco',
    isFinal: true,
  },
  '800.100.155': {
    status: TransactionStatus.FAILED,
    userMessage: 'Fondos insuficientes',
    isFinal: true,
  },
  '800.100.157': {
    status: TransactionStatus.FAILED,
    userMessage: 'Fecha de expiración incorrecta',
    isFinal: true,
  },
  '800.100.159': {
    status: TransactionStatus.FAILED,
    userMessage: 'Tarjeta reportada como robada',
    isFinal: true,
  },
  '800.100.165': {
    status: TransactionStatus.FAILED,
    userMessage: 'Tarjeta reportada como perdida',
    isFinal: true,
  },
  '800.100.168': {
    status: TransactionStatus.FAILED,
    userMessage: 'Tarjeta restringida',
    isFinal: true,
  },
  '800.100.170': {
    status: TransactionStatus.FAILED,
    userMessage: 'Transacción no permitida',
    isFinal: true,
  },
  '800.100.171': {
    status: TransactionStatus.FAILED,
    userMessage: 'Retenga la tarjeta y llame al banco',
    isFinal: true,
  },
  '800.100.174': {
    status: TransactionStatus.FAILED,
    userMessage: 'Monto inválido',
    isFinal: true,
  },
  '800.100.176': {
    status: TransactionStatus.FAILED,
    userMessage: 'Cuenta temporalmente no disponible - Reintente luego',
    isFinal: true,
  },
  '800.100.179': {
    status: TransactionStatus.FAILED,
    userMessage: 'Excede límite de transacciones permitidas',
    isFinal: true,
  },
  '800.100.190': {
    status: TransactionStatus.FAILED,
    userMessage: 'Configuración inválida',
    isFinal: true,
  },
  '800.100.197': {
    status: TransactionStatus.FAILED,
    userMessage: 'Cancelado por el usuario',
    isFinal: true,
  },
  '800.100.199': {
    status: TransactionStatus.FAILED,
    userMessage: 'Cálculo de impuestos incorrecto',
    isFinal: true,
  },
  '800.100.402': {
    status: TransactionStatus.FAILED,
    userMessage: 'Nombre del tarjetahabiente inválido',
    isFinal: true,
  },
  '800.100.501': {
    status: TransactionStatus.FAILED,
    userMessage: 'Establecimiento cancelado',
    isFinal: true,
  },
  '800.300.500': {
    status: TransactionStatus.FAILED,
    userMessage: 'Tarjeta en lista negra - Demasiados intentos con CVV incorrecto',
    isFinal: true,
  },
  '800.300.501': {
    status: TransactionStatus.FAILED,
    userMessage: 'Tarjeta en lista negra - Demasiados intentos con fecha incorrecta',
    isFinal: true,
  },
  '900.100.100': {
    status: TransactionStatus.FAILED,
    userMessage: 'Error de comunicación con el banco',
    isFinal: true,
  },
  '900.100.200': {
    status: TransactionStatus.FAILED,
    userMessage: 'Error de respuesta del banco',
    isFinal: true,
  },
  '900.100.201': {
    status: TransactionStatus.FAILED,
    userMessage: 'Error en el gateway externo (banco) - Reintente luego',
    isFinal: true,
  },
  '900.100.300': {
    status: TransactionStatus.FAILED,
    userMessage: 'Sin respuesta del banco - Resultado incierto',
    isFinal: true,
  },
  '100.400.147': {
    status: TransactionStatus.FAILED,
    userMessage: 'Transacción rechazada por regla antifraude',
    isFinal: true,
  },
  '100.400.149': {
    status: TransactionStatus.FAILED,
    userMessage: 'Error en datos de antifraude',
    isFinal: true,
  },
  '100.400.325': {
    status: TransactionStatus.FAILED,
    userMessage: 'Sistema antifraude no disponible',
    isFinal: true,
  },
  '100.380.401': {
    status: TransactionStatus.FAILED,
    userMessage: 'Código de autenticación incorrecto (3DS)',
    isFinal: true,
  },
  '100.380.501': {
    status: TransactionStatus.FAILED,
    userMessage: 'Tiempo de autenticación expirado (3DS)',
    isFinal: true,
  },
  '100.396.103': {
    status: TransactionStatus.FAILED,
    userMessage: 'Tiempo de autenticación expirado (DINERS/DISCOVER)',
    isFinal: true,
  },
};