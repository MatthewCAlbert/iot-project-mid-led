import httpStatus from "http-status";
import { User } from "../data/entities/user.entity";
import ApiError from "../utils/ApiError";
import jwt from '../utils/jwt';

const sanitizeUserProfile = ( user: Record<string, any> )=>{
  let sanitizedUser: Record<string, any> = {};
  for( let key in user ){
    if( !["hash", "salt"].includes(key) )
      sanitizedUser[key] = user[key];
  }
  return sanitizedUser;
}

export const getUserProfileService = (user: User)=>{
  return sanitizeUserProfile(user);
}

export const loginService = async (username: string, password: string): Promise<{
  user: any, 
  token: string, 
  expiresIn: string 
}>=>{
  return new Promise((resolve, reject)=>{
    User.findOne({username})
    .then((user)=>{
      if(!user){
        return reject(new ApiError(httpStatus.UNAUTHORIZED, "user not found"))
      }

      const isValid = jwt.validPassword(password, user?.hash, user?.salt);

      if(isValid){
        const tokenObj = jwt.issueJWT(user);
        resolve({ 
          user: sanitizeUserProfile(user), 
          token: tokenObj.token, 
          expiresIn: tokenObj.expires 
        })  
      }else
        reject(new ApiError(httpStatus.UNAUTHORIZED, "wrong password"))
    });
  })
}

export const changePasswordService = async (user: User, body: { oldPassword: string, newPassword: string })=>{
    const isValid = jwt.validPassword(body.oldPassword, user.hash, user.salt);

    if( !isValid ){
      throw new ApiError(httpStatus.UNAUTHORIZED, "Password identity mismatch")
    }

    const saltHash = jwt.genPassword(body.newPassword);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    try {
      const c_user = await User.findOne( {id: user.id} );
      c_user.salt = salt;
      c_user.hash = hash;
      if ( await c_user.save() ){
        const tokenObj = jwt.issueJWT(c_user);
        return { 
          user, 
          token: tokenObj.token, 
          expiresIn: tokenObj.expires 
        }
      }
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Password change failed");
    }
}

export const registerUserService = async (body: { password: string, name: string, username: string })=>{
  const saltHash = jwt.genPassword(body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User();
  newUser.name = body.name;
  newUser.username = body.username;
  newUser.hash = hash;
  newUser.salt = salt;

  await newUser.save();

  const tokenObj = jwt.issueJWT(newUser);
  return { 
    user: newUser, 
    token: tokenObj.token, 
    expiresIn: tokenObj.expires 
  } 
}