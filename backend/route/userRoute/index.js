const express = require('express');
const userController = require('../../controller/userController/index');
const authMiddleware = require('../../middleware/auth');
const authValidation = require('../../middleware/validate')
const validation = require('../../validator/validate')
const {upload} = require("../../config/multerConfig");

const router = express.Router();

router.post('/register', upload, userController.register);
router.post('/login', authValidation(validation.loginValidation),userController.login); 
router.get('/profile', authMiddleware, userController.getProfile);
router.get('/all-users', userController.getAllUsers);
router.patch('/update', authValidation(validation.updateUserValidation),authMiddleware, userController.updateUser);
router.delete('/delete', authMiddleware, userController.deleteUser);
router.post('/forgot-password',authValidation(validation.forgotPasswordValidation),userController.forgotPassword);
router.post('/reset-password', authValidation(validation.resetPasswordValidation),userController.resetPassword);

module.exports = router;
