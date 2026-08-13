import { DatafastClient } from './datafast.client';
import { datafastConfig, DATAFAST_CONSTANTS, DATAFAST_TEST_MODE_ENABLED } from '../../config/datafast';
import { logger } from '../../config/logger';
import { 
  ICreateCheckoutRequest, 
  ICreateCheckoutResponse,
  IPaymentStatusResponse,
  IRefundRequest,
  IRefundResponse,
  ITokenPaymentRequest,
  ITokenPaymentResponse
} from './types/datafast.types';

const SCRIPT_TEST_LOGS_ENABLED = process.env.NODE_ENV !== 'production';

export class DatafastService {
  private client: DatafastClient;

  constructor() {
    this.client = new DatafastClient();
  }

  /**
   * PASO 1: Crear Checkout (Obtener checkoutId)
   */
  async createCheckout(data: ICreateCheckoutRequest): Promise<ICreateCheckoutResponse> {
    const url = '/v1/checkouts';
    
    // Construir los parámetros
    const params = new URLSearchParams();
    
    // Datos básicos
    params.append('entityId', datafastConfig.entityId);
    params.append('amount', data.amount.toFixed(2));
    params.append('currency', 'USD');
    params.append('paymentType', 'DB');
    params.append('shopperResultUrl', datafastConfig.shopperResultUrl);
    
    // Datos del cliente (Fase 2 - Obligatorios)
    params.append('customer.givenName', data.customer.givenName);
    if (data.customer.middleName) {
      params.append('customer.middleName', data.customer.middleName);
    }
    params.append('customer.surname', data.customer.surname);
    params.append('customer.ip', data.customer.ip);
    params.append('customer.merchantCustomerId', data.customer.merchantCustomerId);
    params.append('customer.email', data.customer.email);
    params.append('customer.identificationDocType', data.customer.identificationDocType || 'IDCARD');
    params.append('customer.identificationDocId', data.customer.identificationDocId.padStart(10, '0'));
    params.append('customer.phone', data.customer.phone);
    
    // Datos de facturación
    params.append('billing.street1', data.billing.street1);
    params.append('billing.country', data.billing.country);
    
    // Datos de envío
    params.append('shipping.street1', data.shipping?.street1 || data.billing.street1);
    params.append('shipping.country', data.shipping?.country || data.billing.country);
    
    // Impuestos (obligatorios)
    params.append('customParameters[SHOPPER_VAL_BASE0]', data.taxes.base0.toFixed(2));
    params.append('customParameters[SHOPPER_VAL_BASEIMP]', data.taxes.baseImp.toFixed(2));
    params.append('customParameters[SHOPPER_VAL_IVA]', data.taxes.iva.toFixed(2));
    
    // Datos de comercio
    params.append('customParameters[SHOPPER_MID]', datafastConfig.merchantId);
    params.append('customParameters[SHOPPER_TID]', datafastConfig.terminalId);
    params.append('customParameters[SHOPPER_ECI]', DATAFAST_CONSTANTS.ECI);
    params.append('customParameters[SHOPPER_PSERV]', DATAFAST_CONSTANTS.PSERV);
    params.append('customParameters[SHOPPER_VERSIONDF]', DATAFAST_CONSTANTS.VERSION);
    
    // Tipo de crédito (opcional)
    if (data.creditType) {
      params.append('customParameters[SHOPPER_TIPOCREDITO]', data.creditType);
    }
    
    // Número de cuotas (opcional)
    if (data.installments) {
      params.append('customParameters[SHOPPER_INSTALLMENTS]', data.installments.toString());
    }
    
    // Risk parameters
    params.append('risk.parameters[USER_DATA2]', datafastConfig.merchantId);
    
    // Items del carrito
    if (data.items && data.items.length > 0) {
      data.items.forEach((item, index) => {
        params.append(`cart.items[${index}].name`, item.name);
        params.append(`cart.items[${index}].description`, item.description || item.name);
        params.append(`cart.items[${index}].price`, item.price.toFixed(2));
        params.append(`cart.items[${index}].quantity`, item.quantity.toString());
      });
    }
    
    // Merchant Transaction ID (único por transacción)
    params.append('merchantTransactionId', data.merchantTransactionId);
    
    // Test mode (SOLO si DATAFAST_TEST_MODE=true en el .env; nunca en producción)
    if (DATAFAST_TEST_MODE_ENABLED) {
      params.append('testMode', 'EXTERNAL');
    }
    
    // Tokenización (OneClickCheckout)
    if (data.createRegistration) {
      params.append('createRegistration', 'true');
    }
    
    // Registrations existentes (para OneClickCheckout)
    if (data.registrations && data.registrations.length > 0) {
      data.registrations.forEach((reg, index) => {
        params.append(`registrations[${index}].id`, reg.id);
      });
    }
    
    try {
      // ===== LOG SCRIPT DE PRUEBAS: PAYLOAD =====
      if (SCRIPT_TEST_LOGS_ENABLED) {
        console.log('\n📦 ===== PAYLOAD ENVIADO A DATAFAST (CHECKOUT) =====');
        console.log(params.toString());
        console.log('=================================================\n');
      }

      const response = await this.client.post<ICreateCheckoutResponse>(
        url,
        params.toString()
      );
      
      logger.info(`✅ Checkout creado: ${response.id}`);
      return response;
    } catch (error) {
      logger.error({ err: error }, 'Error creando checkout');
      throw error;
    }
  }

  /**
   * PASO 3: Obtener estado de la transacción
   */
  async getPaymentStatus(resourcePath: string): Promise<IPaymentStatusResponse> {
    const url = resourcePath;
    
    try {
      const response = await this.client.get<IPaymentStatusResponse>(
        url,
        { entityId: datafastConfig.entityId }
      );
      
      logger.info({ result: response.result, resultDetails: response.resultDetails }, `Estado de transacción: ${response.result?.code}`);
      return response;
    } catch (error) {
      // Datafast puede devolver el resultado del pago con un estado HTTP 4xx.
      // En ese caso el body contiene los códigos de resultado que la página
      // de resultado necesita mostrar. Se extrae y se devuelve como data.
      const axiosError = error as {
        response?: { status?: number; data?: IPaymentStatusResponse };
      };
      const errorBody = axiosError.response?.data;

      if (errorBody && typeof errorBody === 'object' && (errorBody as IPaymentStatusResponse).result) {
        logger.info(
          { result: (errorBody as IPaymentStatusResponse).result },
          `Estado de transacción (HTTP ${axiosError.response?.status}): ${(errorBody as IPaymentStatusResponse).result?.code}`
        );
        return errorBody;
      }

      logger.error({ err: error }, 'Error obteniendo estado');
      throw error;
    }
  }

  /**
   * Anulación de transacción
   */
  async refundTransaction(transactionId: string, data: IRefundRequest): Promise<IRefundResponse> {
    const url = `/v1/payments/${transactionId}`;
    
    const params = new URLSearchParams();
    params.append('entityId', datafastConfig.entityId);
    params.append('amount', data.amount.toFixed(2));
    params.append('paymentType', 'RF');
    
    if (data.merchantTransactionId) {
      params.append('merchantTransactionId', data.merchantTransactionId);
    }
    
    try {
      // ===== LOG SCRIPT DE PRUEBAS: PAYLOAD ANULACIÓN =====
      if (SCRIPT_TEST_LOGS_ENABLED) {
        console.log('\n📦 ===== PAYLOAD ENVIADO A DATAFAST (ANULACIÓN) =====');
        console.log(params.toString());
        console.log('===================================================\n');
      }

      const response = await this.client.post<IRefundResponse>(
        url,
        params.toString()
      );
      
      logger.info(`✅ Anulación creada: ${response.id}`);
      return response;
    } catch (error) {
      logger.error({ err: error }, 'Error en anulación');
      throw error;
    }
  }

  /**
   * Pago recurrente con token
   */
  async createRecurringPayment(token: string, data: ITokenPaymentRequest): Promise<ITokenPaymentResponse> {
    const url = `/v1/registrations/${token}/payments`;
    
    const params = new URLSearchParams();
    params.append('entityId', datafastConfig.entityId);
    params.append('amount', data.amount.toFixed(2));
    params.append('currency', 'USD');
    params.append('paymentType', 'DB');
    params.append('recurringType', 'REPEATED');
    params.append('risk.parameters[USER_DATA1]', 'REPEATED');
    params.append('risk.parameters[USER_DATA2]', datafastConfig.merchantId);
    
    // Merchant Transaction ID (único por transacción)
    params.append('merchantTransactionId', data.merchantTransactionId);
    
    // Impuestos
    params.append('customParameters[SHOPPER_VAL_BASE0]', data.taxes.base0.toFixed(2));
    params.append('customParameters[SHOPPER_VAL_BASEIMP]', data.taxes.baseImp.toFixed(2));
    params.append('customParameters[SHOPPER_VAL_IVA]', data.taxes.iva.toFixed(2));
    params.append('customParameters[SHOPPER_MID]', datafastConfig.merchantId);
    params.append('customParameters[SHOPPER_TID]', datafastConfig.terminalId);
    params.append('customParameters[SHOPPER_ECI]', DATAFAST_CONSTANTS.ECI);
    params.append('customParameters[SHOPPER_PSERV]', DATAFAST_CONSTANTS.PSERV);
    params.append('customParameters[SHOPPER_VERSIONDF]', DATAFAST_CONSTANTS.VERSION);
    
    // Test mode (SOLO si DATAFAST_TEST_MODE=true en el .env; nunca en producción)
    if (DATAFAST_TEST_MODE_ENABLED) {
      params.append('testMode', 'EXTERNAL');
    }
    
    try {
      const response = await this.client.post<ITokenPaymentResponse>(
        url,
        params.toString()
      );
      
      logger.info(`✅ Pago recurrente creado: ${response.id}`);
      return response;
    } catch (error) {
      logger.error({ err: error }, 'Error en pago recurrente');
      throw error;
    }
  }

  /**
   * Eliminar token
   */
  async deleteToken(registrationId: string): Promise<void> {
    const url = `/v1/registrations/${registrationId}`;
    
    try {
      await this.client.delete(url);
      logger.info(`✅ Token eliminado: ${registrationId}`);
    } catch (error) {
      logger.error({ err: error }, 'Error eliminando token');
      throw error;
    }
  }

  /**
   * Verificar transacción por ID
   */
  async verifyTransactionByPaymentId(paymentId: string): Promise<IPaymentStatusResponse> {
    const url = `/v1/query/${paymentId}`;
    
    try {
      const response = await this.client.get<IPaymentStatusResponse>(
        url,
        { entityId: datafastConfig.entityId }
      );
      
      return response;
    } catch (error) {
      const axiosError = error as {
        response?: { status?: number; data?: IPaymentStatusResponse };
      };
      const errorBody = axiosError.response?.data;

      if (errorBody && typeof errorBody === 'object' && (errorBody as IPaymentStatusResponse).result) {
        return errorBody;
      }

      logger.error({ err: error }, 'Error verificando transacción');
      throw error;
    }
  }

  /**
   * Verificar transacción por merchantTransactionId
   */
  async verifyTransactionByMerchantId(merchantTransactionId: string): Promise<IPaymentStatusResponse> {
    const url = `/v1/query`;
    
    try {
      const response = await this.client.get<IPaymentStatusResponse>(
        url,
        { 
          entityId: datafastConfig.entityId,
          merchantTransactionId: merchantTransactionId
        }
      );
      
      return response;
    } catch (error) {
      const axiosError = error as {
        response?: { status?: number; data?: IPaymentStatusResponse };
      };
      const errorBody = axiosError.response?.data;

      if (errorBody && typeof errorBody === 'object' && (errorBody as IPaymentStatusResponse).result) {
        return errorBody;
      }

      logger.error({ err: error }, 'Error verificando transacción');
      throw error;
    }
  }
}