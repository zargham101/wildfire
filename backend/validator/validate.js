const Joi = require("joi");

const passwordValidation = Joi.string()
  .min(6)
  .max(12)
  .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$%^&*])"))
  .message(
    "Password must be 6-12 characters long, contain at least one uppercase letter and one special character."
  );

const registerValidation = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is empty",
    "any.required": "Name is empty",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is empty",
    "any.required": "Email is empty",
  }),
  password: passwordValidation,
  image: Joi.string(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateUserValidation = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  password: passwordValidation,
}).or("name", "email", "password");

const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordValidation = Joi.object({
  resetToken: Joi.string().required(),
  newPassword: passwordValidation.required(),
});

const reviewValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  country: Joi.string().min(2).max(50).required(),
  description: Joi.string().min(10).max(500).required(),
});

module.exports = {
  registerValidation,
  loginValidation,
  updateUserValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  reviewValidation,
};
