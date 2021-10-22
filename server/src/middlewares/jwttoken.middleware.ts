import jwt from 'jsonwebtoken';
import express from 'express';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { User } from '../data/entities/user.entity';
import config from '../config/config';
import { AuthJwtPayload } from '../utils/jwt';

const jwtTokenMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if(!req.headers.authorization)
      return next(new ApiError(httpStatus.UNAUTHORIZED,"Token missing"));
  if(!req.headers.authorization.startsWith("Bearer"))
      return next(new ApiError(httpStatus.BAD_REQUEST,"Token malformed"));
  
  const authHeader = req.headers["authorization"];
  const token: string|undefined = authHeader && authHeader.split(" ")[1];

  jwt.verify(String(token), config.jwt.secret, async (err, payload: AuthJwtPayload) => {
    if (err){
      return next(new ApiError(httpStatus.UNAUTHORIZED,"Token unauthorized"))
    }
    const fetchedUser = await User.findOne({id: payload?.sub});

    if( fetchedUser ){
      req.user = fetchedUser;
      next();
    }else{
      next( new ApiError(httpStatus.UNAUTHORIZED,"User not found") );
    }

  });
};

export default jwtTokenMiddleware;
