const Joi = require("joi");

const registrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().min(3).max(30).required(),

  repeat_password: Joi.ref("password"),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
}).with("password", "repeat_password");

module.exports = {
  registrationSchema,
};
