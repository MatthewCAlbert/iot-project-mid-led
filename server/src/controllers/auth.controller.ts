import express from "express";
import httpStatus from "http-status";
import { User } from "../data/entities/user.entity";
import utils from '../utils/jwt';
import ApiError from "../utils/ApiError";
import {sendResponse} from "../utils/api";
import { changePasswordService, getUserProfileService, loginService, registerUserService } from "../services/auth.service";

class AuthController {

  static profile(req: express.Request, res: express.Response) {
    const user: User = req.user;
    return sendResponse(res, { message: "", 
      data: {
        user: getUserProfileService(user)
      }
    });
  }

  static login(req: express.Request, res: express.Response, next: express.NextFunction) {
    loginService(req?.body?.username, req?.body?.password).then((response)=>{
      sendResponse( res, {
        data: response
      })
    }).catch(next);
  }

  static async changePassword(req: express.Request, res: express.Response, next: express.NextFunction) {
    changePasswordService(req.user, req.body).then((response)=>{
      sendResponse( res, {
        data: response
      })
    }).catch(next);
  }

  static async register(req: express.Request, res: express.Response, next: express.NextFunction) {
    registerUserService(req.body).then((response)=>{
      sendResponse( res, {
        data: response
      })
    }).catch(next);
  }
}

export default AuthController;