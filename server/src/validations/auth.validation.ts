import Joi from 'joi';

const authSchemas = {
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  register: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    rePassword: Joi.string().required().valid(Joi.ref('newPassword')).label('Passwords don\'t match'),
  })
};

export default authSchemas;