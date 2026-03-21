const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const authController = require('../controllers/authController');

router.use(authMiddleware.protect);

// Profile routes
router.get('/me', authController.getCurrentUser);
router.put('/profile', authController.updateProfile);
router.put('/change-password', authController.changePassword);

module.exports = router;
