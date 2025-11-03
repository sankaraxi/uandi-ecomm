const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/verify', authController.verify);

module.exports = router;