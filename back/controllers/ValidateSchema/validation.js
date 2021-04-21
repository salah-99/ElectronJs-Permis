// VALIDATION
const Joi = require("joi");

// Register validation Conducteur
const registerValidation = data => {
  const schema = Joi.object({
    firstName: Joi.string()
    .min(2)
    .required(),
    lastName: Joi.string()
      .min(2)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
    confirmerPassword:Joi.string().required().valid(Joi.ref('password'))
  });
  return schema.validate(data);
};

//Login validation
const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .required()
  });
  return schema.validate(data);
};

module.exports ={registerValidation,loginValidation};
