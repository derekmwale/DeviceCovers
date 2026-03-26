const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

router.use(authMiddleware.protect);

// Payment routes
router.get('/', paymentController.getUserPayments);
router.get('/stats', paymentController.getPaymentStats);
router.get('/:id', paymentController.getPayment);
router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);

// Lenco mobile money payment routes
router.post('/lenco/initiate', paymentController.initiateLencoPayment);
router.post('/lenco/verify', paymentController.verifyLencoPayment);
router.get('/lenco/methods', paymentController.getLencoPaymentMethods);

// Lenco webhook (no auth required for webhook verification)
router.post('/webhook/lenco', paymentController.handleLencoWebhook);

module.exports = router;
