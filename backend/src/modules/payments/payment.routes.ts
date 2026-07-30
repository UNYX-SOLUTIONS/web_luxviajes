import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();
const controller = new PaymentController();

router.post('/create-checkout', (req, res, next) => controller.createCheckout(req, res, next));
router.get('/status', (req, res, next) => controller.getPaymentStatus(req, res, next));
router.post('/refund', (req, res, next) => controller.refundTransaction(req, res, next));
router.get('/verify/:paymentId', (req, res, next) => controller.verifyTransaction(req, res, next));
router.post('/recurring', (req, res, next) => controller.createRecurringPayment(req, res, next));
router.delete('/token/:registrationId', (req, res, next) => controller.deleteToken(req, res, next));

export { router as paymentRoutes };
