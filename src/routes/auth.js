const express = require('express');
const authController = require('../controllers/auth')

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/user/:id", authController.getUser);
router.patch("/editUser/:id", authController.editUser)
// router.post("/demoSignup", authController.demoSignup);
// router.post("/demoLogin", authController.demoLogin);
router.post('/sendOtp', authController.sendOtp )
router.post('/verifyOtp', authController.varifyOtp)
router.post('/changePassword', authController.changePassword)
// lipseys
router.post('/lipseysLogin', authController.lipseysLogin)

module.exports = router;