import Joi from 'joi';

const authSchemas = {
  login: {
    body: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    })
  },
  register: {
    body: Joi.object({
      name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
    })
  },
  changePassword: {
    body: Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
      rePassword: Joi.string().required().valid(Joi.ref('newPassword')).label('Passwords don\'t match'),
    })
  }
};

export default authSchemas;