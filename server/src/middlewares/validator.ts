import express from "express";
import Joi from "joi";

const validator = (schema: Joi.Schema, property = "body") => { 
  return (req: express.Request, res: express.Response, next: express.NextFunction) => { 
      const { error } = schema.validate(req[property]); 
      const valid = error == null; 
      if (valid) { next(); } 
      else { 
        const { details } = error; 
        const message = details.map(i => i.message).join(',')
        res.status(422).json({ success: false, error: message }) 
      } 
  } 
} 

export {validator};