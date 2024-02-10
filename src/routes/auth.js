const express = require('express');
const authController = require('../controllers/auth')

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/demoSignup", authController.demoSignup);
router.post("/demoLogin", authController.demoLogin);
router.post('/sendOtp', authController.sendOtp )
router.post('/verifyOtp', authController.varifyOtp)
router.post('/changePassword', authController.changePassword)

module.exports = router;