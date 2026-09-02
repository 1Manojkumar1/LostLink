const express = require('express');
const passport = require('passport');
const { googleCallback, getMe, logout } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallback
);

router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

module.exports = router;