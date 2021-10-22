import Joi from 'joi';

const apiSchemas = {
  sendCommand: {
    body: Joi.object({
      command: Joi.string().valid("on","off").required()
    })
  },
  setSchedule: {
    body: Joi.object({
      time: Joi.date().required(),
      command: Joi.string().valid("on","off").required(),
    })
  }
};

export default apiSchemas;