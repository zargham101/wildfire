const Joi = require('joi');

const passwordValidation = Joi.string()
    .min(6)
    .max(12)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$%^&*])")) // At least 1 uppercase, 1 special character
    .message('Password must be 6-12 characters long, contain at least one uppercase letter and one special character.');

const registerValidation = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: passwordValidation.required(),
});

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateUserValidation = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    password: passwordValidation
}).or('name', 'email', 'password') 

const forgotPasswordValidation = Joi.object({
    email: Joi.string().email().required()
});

const resetPasswordValidation = Joi.object({
    resetToken: Joi.string().required(),
    newPassword: passwordValidation.required()
});

const reviewValidation = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    country: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(10).max(500).required()
});

module.exports = {
    registerValidation,
    loginValidation,
    updateUserValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    reviewValidation
};
