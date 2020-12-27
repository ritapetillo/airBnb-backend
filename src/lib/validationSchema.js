const Joi = require('joi') 
const schemas = { 
  userSchema: Joi.object().keys({ 
    firstName: Joi.string().required() ,
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    about:Joi.string()
  }) 
  // define all the other schemas below 
}; 
module.exports = schemas;
