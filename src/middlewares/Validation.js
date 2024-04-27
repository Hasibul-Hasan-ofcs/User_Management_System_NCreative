const Joi = require("joi");

const signupV = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .required(),
  phone_no: Joi.number().min(9).required(),
  address: Joi.string().min(5).required(),
  user_role: Joi.string().min(3).required(),
});

const loginV = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .required(),
});

const updateUserV = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(6),
  phone_no: Joi.number().min(9),
  address: Joi.string().min(5),
  user_role: Joi.string().min(3),
});

const updateAdminV = Joi.object({
  id: Joi.string().min(10),
  name: Joi.string().min(3),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(6),
  phone_no: Joi.number().min(9),
  address: Joi.string().min(5),
  user_role: Joi.string().min(3),
});

module.exports = { signupV, loginV, updateUserV, updateAdminV };
