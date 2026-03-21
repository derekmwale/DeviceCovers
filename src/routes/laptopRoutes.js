const router = require('express').Router();
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const laptopController = require('../controllers/laptopController');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.use(authMiddleware.protect);

// Laptop routes
router.post('/', upload.single('receipt'), laptopController.addLaptop);
router.get('/', laptopController.getUserLaptops);
router.get('/:id', laptopController.getLaptop);
router.put('/:id', upload.single('receipt'), laptopController.updateLaptop);
router.delete('/:id', laptopController.deleteLaptop);
router.get('/:id/suggested-plans', laptopController.getSuggestedPlans);

module.exports = router;
