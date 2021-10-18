import express from "express";
import utils from '../lib/utils';

class AuthController {

  static check(req: express.Request, res: express.Response): void {
    res.status(200).json({success: true, data: req.user});
  }

  static login(req: express.Request, res: express.Response): void {
    User.findOne({username: req.body.username})
    .then((user)=>{
      if(!user){
        res.status(401).json({success:false, msg: "user not found"});
      }

      const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

      if(isValid){
        const tokenObj = utils.issueJWT(user);

        res.status(200).json({success:true, data:user, token: tokenObj.token, expiresIn: tokenObj.expires});
      }else
        res.status(401).json({success:false, data: null, expiresIn: null, token: null, message: "wrong password"});
    })
    .catch(err=>res.status(500).json({success:false, error: err}));
  }

  static logout(req: express.Request, res: express.Response): void {
    // TODO: Invalidate JWT
   res.send("Hello World!"); 
  }

  static changePassword(req: express.Request, res: express.Response): void {
    let user = req.user;

    const isValid = utils.validPassword(req.body.oldPassword, user.hash, user.salt);

    if( !isValid ){
      res.status(401).json({success:false, data: null, token: null});
      return;
    }

    const saltHash = utils.genPassword(req.body.newPassword);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const update = {salt, hash};

    User.findOneAndUpdate({_id: user._id}, update)
    .then((userUpdated) => {
      const tokenObj = utils.issueJWT(userUpdated);
      res.status(200).json({success:true, data:user, token: tokenObj.token, expiresIn: tokenObj.expires});
    }
    )
    .catch(err=>res.status(500).json({success:false, message:"Password change failed", error: err}));
  }

  static destory(req: express.Request, res: express.Response): void {
   const {username} = req.params;
    User.findOneAndDelete({username: username}).then(() =>
      res.status(200).json({success: true, message: "User deleted!"})
    )
    .catch(err=>res.status(500).json({success:false, message:"Failed", error: err}));
  }

  static register(req: express.Request, res: express.Response): void {
   const saltHash = utils.genPassword(req.body.password);

   const salt = saltHash.salt;
   const hash = saltHash.hash;

   const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
   });

   newUser.save()
   .then(user=>{
    const jwt = utils.issueJWT(user);

     res.json({success: true, data: user, token: jwt.token, expiresIn: jwt.expires})
   })
    .catch(err=>res.status(500).json({success:false, data: null, error: err}));
  }
}

export default AuthController;