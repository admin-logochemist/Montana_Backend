const express = require('express');
const authController = require('../controllers/auth')

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/demoSignup", authController.demoSignup);
router.post("/demoLogin", authController.demoLogin);

module.exports = router;