import { Request, Response, NextFunction } from 'express';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { logger } from '../../config/logger';
import { PaymentService } from './payment.service';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async createCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(CreateCheckoutDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      }

      const clientIp = req.ip || req.socket.remoteAddress || '';

      const result = await this.paymentService.createCheckout({
        ...dto,
        customer: { ...dto.customer, ip: clientIp },
      });

      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      logger.error({ err: error }, 'Error en createCheckout');
      next(error);
    }
  }

  async getPaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { resourcePath } = req.query;

      if (!resourcePath) {
        return res.status(400).json({
          success: false,
          error: 'resourcePath es requerido',
        });
      }

      const result = await this.paymentService.getPaymentStatus(resourcePath as string);

      return res.json({ success: true, data: result });
    } catch (error) {
      logger.error({ err: error }, 'Error en getPaymentStatus');
      next(error);
    }
  }

  async refundTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId, amount, reason } = req.body;

      if (!transactionId || !amount) {
        return res.status(400).json({
          success: false,
          error: 'transactionId y amount son requeridos',
        });
      }

      const result = await this.paymentService.refundTransaction({
        transactionId,
        amount,
        reason,
      });

      return res.json({ success: true, data: result });
    } catch (error) {
      logger.error({ err: error }, 'Error en refundTransaction');
      next(error);
    }
  }

  async verifyTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;
      const result = await this.paymentService.verifyTransaction(paymentId);

      return res.json({ success: true, data: result });
    } catch (error) {
      logger.error({ err: error }, 'Error en verifyTransaction');
      next(error);
    }
  }

  async createRecurringPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { tokenId, amount, taxes } = req.body;

      if (!tokenId || !amount || !taxes) {
        return res.status(400).json({
          success: false,
          error: 'tokenId, amount y taxes son requeridos',
        });
      }

      const result = await this.paymentService.createRecurringPayment({
        tokenId,
        amount,
        taxes,
      });

      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      logger.error({ err: error }, 'Error en createRecurringPayment');
      next(error);
    }
  }

  async deleteToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { registrationId } = req.params;

      if (!registrationId) {
        return res.status(400).json({
          success: false,
          error: 'registrationId es requerido',
        });
      }

      const result = await this.paymentService.deleteToken(registrationId);

      return res.json({ success: true, data: result });
    } catch (error) {
      logger.error({ err: error }, 'Error en deleteToken');
      next(error);
    }
  }
}
