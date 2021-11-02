import Joi from 'joi';

const commandObject = {
  state: Joi.string().valid("ON","OFF").required(),
  color: {
    r: Joi.number().min(0).max(255).required(),
    g: Joi.number().min(0).max(255).required(),
    b: Joi.number().min(0).max(255).required(),
  }
}

const apiSchemas = {
  sendCommand: {
    body: Joi.object({
      command: commandObject
    })
  },
  addNewSchedule: {
    body: Joi.object({
      name: Joi.string().required(),
      when: Joi.date().required(),
      command: commandObject,
    })
  },
  deleteSchedule: {
    params: Joi.object({
      id: Joi.string().required(),
    })
  }
};

export default apiSchemas;