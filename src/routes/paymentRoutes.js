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

module.exports = router;
