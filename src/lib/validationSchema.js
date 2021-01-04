const Joi = require('joi') 
const schemas = { 
  userSchema: Joi.object().keys({ 
    firstName: Joi.string().required() ,
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    about:Joi.string()
  }) ,
  // define all the other schemas below 
  loginSchema: Joi.object().keys({ 
    email: Joi.string().email().required(),
    password:Joi.string().min(6).required(),
  }) 


  
}; 
module.exports = schemas;
