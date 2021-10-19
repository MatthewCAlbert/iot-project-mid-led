import Joi from 'joi';

const apiSchemas = {
  sendCommand: Joi.object({
    command: Joi.string().valid("on","off").required()
  }),
  setSchedule: Joi.object({
    time: Joi.date().required(),
    command: Joi.string().valid("on","off").required(),
  })
};

export default apiSchemas;