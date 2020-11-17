const joi = require('@hapi/joi');


const authSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password:joi.string().min(8).required()       //use regular expression for lower,uppercase and degit pwd
});

module.exports = {
    authSchema
}