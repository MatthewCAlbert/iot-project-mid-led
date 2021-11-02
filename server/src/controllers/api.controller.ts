import express from "express";
import { User } from "../data/entities/user.entity";
import ApiError from "../utils/ApiError";
import { sendResponse } from "../utils/api";
import httpStatus from "http-status";
import { Schedule } from "../data/entities/schedule.entity";
import { cancelScheduledCommand, scheduleCommand } from "../config/scheduler";
import config from "../config/config";

class ApiController{
  static helloWorldHandler(req: express.Request, res: express.Response) {
    return sendResponse(res, {
      message: "Hello World!"
    })
  }

  static testAuth(req: express.Request, res: express.Response) {
    return sendResponse(res, {
      data: "Ok"
    })
  }
  
  static async allUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const result = await User.find();
      return sendResponse(res, {
        data: result
      })
    } catch (error) {
      next(new ApiError(404, "no user found"))
    }
  }

  static clearDb(req: express.Request, res: express.Response, next: express.NextFunction) {
    next(new ApiError(httpStatus.FORBIDDEN, "feature just not available yet"));
  }

  static async allSchedule(req: express.Request, res: express.Response, next: express.NextFunction){
    try {
      const result = await Schedule.find();
      return sendResponse(res, {
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async getScheduleDetail(req: express.Request, res: express.Response, next: express.NextFunction){
    try {
      const {id} = req.params;
      const result = await Schedule.createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.user', 'user')
        .select(['schedule','user.id', 'user.username', 'user.name'])
        .where({id}).getOneOrFail();

      return sendResponse(res, {
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async addNewSchedule(req: express.Request, res: express.Response, next: express.NextFunction){
    try {
      const { when, command, name } = req.body;

      const newSchedule = new Schedule();
      newSchedule.user = req.user.id;
      newSchedule.name = name;
      newSchedule.command = JSON.stringify(command);
      newSchedule.when = when;

      const savedSchedule = await newSchedule.save();

      scheduleCommand(req?.mqtt, savedSchedule);

      return sendResponse(res, {
        data: savedSchedule,
        message: 'New Schedule Success'
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteSchedule(req: express.Request, res: express.Response, next: express.NextFunction){
    try {
      const { id } = req.params;

      await Schedule.delete({id});

      if( !config.env.match('testing') )
        cancelScheduledCommand(id);

      return sendResponse(res, {
        message: 'Delete Schedule Success'
      })
    } catch (error) {
      next(error)
    }
  }

  static async sendCommand(req: express.Request, res: express.Response, next: express.NextFunction){
    try {
      req?.mqtt?.sendCommand(req?.body?.command);
      return sendResponse(res, {
        message: 'Schedule Success'
      });
    } catch (error) {
      next(error);
    }
  }

}

export default ApiController;