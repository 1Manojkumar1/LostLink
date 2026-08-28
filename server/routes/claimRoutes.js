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
  completeHandover,
  sendThankYou,
} = require('../controllers/claimController');

router.use(authMiddleware);

router.post('/', createClaim);
router.get('/mine', getMyClaims);
router.get('/incoming', getIncomingClaims);
router.get('/item/:itemId', getItemClaims);
router.patch('/:id/approve', approveClaim);
router.patch('/:id/reject', rejectClaim);
router.patch('/:id/complete-handover', completeHandover);
router.post('/:id/thank-you', sendThankYou);

module.exports = router;
