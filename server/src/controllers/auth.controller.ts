import express from "express";
import httpStatus from "http-status";
import { User } from "../data/entities/user.entity";
import utils from '../utils/jwt';
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

class AuthController {

  static check(req: express.Request, res: express.Response) {
    return new ApiResponse(res, { message: "", 
      data: req.user
    });
  }

  static login(req: express.Request, res: express.Response) {
    User.findOne({username: req.body.username})
    .then((user)=>{
      if(!user){
        return new ApiError(httpStatus.UNAUTHORIZED, "user not found");
      }

      const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

      if(isValid){
        const tokenObj = utils.issueJWT(user);
        return new ApiResponse(res, { message: "", 
          data: { 
            user, 
            token: tokenObj.token, 
            expiresIn: tokenObj.expires 
          } 
        });
      }else
        return new ApiError(httpStatus.UNAUTHORIZED, "wrong password");
    })
    .catch(err=>res.status(500).json({success:false, error: err}));
  }

  static async changePassword(req: express.Request, res: express.Response) {
    let user = req.user;

    const isValid = utils.validPassword(req.body.oldPassword, user.hash, user.salt);

    if( !isValid ){
      return new ApiError(httpStatus.UNAUTHORIZED, "Password identity mismatch");
    }

    const saltHash = utils.genPassword(req.body.newPassword);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    try {
      const c_user = await User.findOne( {id: user.id} );
      c_user.salt = salt;
      c_user.hash = hash;
      if ( await c_user.save() ){
        const tokenObj = utils.issueJWT(c_user);
        return new ApiResponse(res, { message: "", 
          data: { 
            user, 
            token: tokenObj.token, 
            expiresIn: tokenObj.expires 
          } 
        });
      }
    } catch (error) {
      return new ApiError(httpStatus.UNAUTHORIZED, "Password change failed");
    }
  }

  static async destory(req: express.Request, res: express.Response) {
    const {id} = req.params;
    try {
      const response = await User.delete({ id: id });
      return new ApiResponse(res, { statusCode: httpStatus.ACCEPTED, message: "User deleted" })
    } catch (error) {
      return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Password change failed");
    }
  }

  static async register(req: express.Request, res: express.Response) {
   const saltHash = utils.genPassword(req.body.password);

   const salt = saltHash.salt;
   const hash = saltHash.hash;

   try {
    const newUser = new User();
    newUser.name = req.body.name;
    newUser.username = req.body.username;
    newUser.hash = hash;
    newUser.salt = salt;

    await newUser.save();

    const tokenObj = utils.issueJWT(newUser);
    return new ApiResponse(res, { message: "", 
      data: { 
        user: newUser, 
        token: tokenObj.token, 
        expiresIn: tokenObj.expires 
      } 
    });
   } catch (error) {
    return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Register Failed");
   }

  }
}

export default AuthController;