import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, googleAuthSuccess, getMe } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- LOCAL & USER AUTHENTICATION ROUTES ---
router.post('/register', protect, admin, registerUser);
router.post('/login', loginUser);

// This is the new, critical route for session persistence.
router.get('/me', protect, getMe);


// --- GOOGLE OAUTH ROUTES ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    // ENTERPRISE FIX: Use environment variable for the redirect URL
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?status=failed`,
    session: false
  }),
  (req, res) => {
    // On success, redirect to another backend route to handle sending the token
    res.redirect('/api/auth/success');
  }
);

router.get('/success', googleAuthSuccess);

export default router;

