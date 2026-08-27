const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createClaim,
  getMyClaims,
  getIncomingClaims,
  getItemClaims,
  approveClaim,
  rejectClaim,
} = require('../controllers/claimController');

router.use(authMiddleware);

router.post('/', createClaim);
router.get('/mine', getMyClaims);
router.get('/incoming', getIncomingClaims);
router.get('/item/:itemId', getItemClaims);
router.patch('/:id/approve', approveClaim);
router.patch('/:id/reject', rejectClaim);

module.exports = router;
