import express from "express";
import { User } from "../data/entities/user.entity";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

class ApiController{
  static helloWorldHandler(req: express.Request, res: express.Response) {
    res.status(200).json({message: "Hello World!"}); 
  }

  static testAuth(req: express.Request, res: express.Response) {
    return new ApiResponse(res, {
      data: "Ok"
    })
  }
  
  static async allUser(req: express.Request, res: express.Response) {
    try {
      const result = await User.find();
      return new ApiResponse(res, {
        data: result
      })
    } catch (error) {
      return new ApiError(404, "no user found")
    }
  }

  static clearDb(req: express.Request, res: express.Response) {
    res.sendStatus(403);
  }

}

export default ApiController;