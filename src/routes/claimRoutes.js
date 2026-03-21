const router = require('express').Router();
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const claimController = require('../controllers/claimController');

// Multer configuration for claim evidence
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/claims/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.use(authMiddleware.protect);

// Claim routes
router.post('/', upload.array('evidence', 5), claimController.submitClaim);
router.get('/', claimController.getUserClaims);
router.get('/stats', claimController.getClaimStats);
router.get('/:id', claimController.getClaimDetails);
router.get('/track/:id', claimController.trackClaim);
router.get('/number/:claimNumber', claimController.getClaimByNumber);
router.post('/:id/evidence', upload.array('evidence', 5), claimController.addEvidence);

module.exports = router;
