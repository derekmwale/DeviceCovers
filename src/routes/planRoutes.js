const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const planController = require('../controllers/planController');

router.use(authMiddleware.protect);

// Plan routes
router.post('/', planController.createPlan);
router.get('/', planController.getUserPlans);
router.get('/:id', planController.getPlan);
router.get('/:id/details', planController.getPlanDetails);
router.put('/:id/cancel', planController.cancelPlan);

module.exports = router;
