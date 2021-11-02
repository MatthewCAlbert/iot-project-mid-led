import express from "express";
import MqttHandler from "../config/mqtt";

const mqttBinder = (mqttHandler: MqttHandler) => { 
  return (req: express.Request, res: express.Response, next: express.NextFunction) => { 
    req.mqtt = mqttHandler;
    return next();
  } 
} 

export default mqttBinder;