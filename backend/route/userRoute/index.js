const express = require('express');
const userController = require('../../controller/userController/index');
const userService = require("../../services/userService/userService");
const authMiddleware = require('../../middleware/auth');
const authValidation = require('../../middleware/validate');
const validation = require('../../validator/validate');
const {upload} = require("../../config/multerConfig");

const router = express.Router();

router.post('/register', upload,authValidation(validation.registerValidation), userController.register);
router.post('/admin-signup', upload,authValidation(validation.registerValidation), userController.adminUserCreation);
router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.verifyOtp);
router.post('/login', authValidation(validation.loginValidation),userController.login); 
router.get('/profile', authMiddleware, userController.getProfile);
router.get('/all-users', userController.getAllUsers);
router.get('/user-role', userController.getUsers);
router.get('/user-details/:id',userController.getUserById);
router.patch('/update', authValidation(validation.updateUserValidation),authMiddleware, userController.updateUser);
router.delete('/delete', authMiddleware, userController.deleteUser);
router.post('/forgot-password',authValidation(validation.forgotPasswordValidation),userController.forgotPassword);
router.post('/reset-password', authValidation(validation.resetPasswordValidation),userController.resetPassword);
router.get('/google', userService.googleLogin);
router.get('/google/callback', userService.googleCallback, userController.googleLoginSuccess);

module.exports = router;
