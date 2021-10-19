import jwt from 'jsonwebtoken';
import express from 'express';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const jwtTokenMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return new Promise( (resolve, reject)=>{

    if(!req.headers.authorization)
        return reject(new ApiError(httpStatus.FORBIDDEN,"Token missing"));
    if(!req.headers.authorization.startsWith("Bearer"))
        return reject(new ApiError(httpStatus.BAD_REQUEST,"Token malformed"));
    
    const authHeader = req.headers["authorization"];
    const token: string|undefined = authHeader && authHeader.split(" ")[1];
    
    if (token === null) return res.sendStatus(401);

    jwt.verify(String(token), String(process.env.ACCESS_TOKEN_SECRET), (err, user) => {
      if (err) reject(new ApiError(httpStatus.UNAUTHORIZED,"Token unauthorized"));
      req.user = user;

      // TODO: Verify user

      resolve(true);
    });

  } )
    .then(()=>next())
    .catch((err)=>next(err));
};

export default jwtTokenMiddleware;
