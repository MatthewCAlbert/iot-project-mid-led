import express from 'express';
import AuthController from '../controllers/auth.controller';
import jwtTokenMiddleware from '../middlewares/jwttoken.middleware';
import validator from '../middlewares/validator.middleware';
import authSchemas from '../validations/auth.validation';

// Auth Routes /api/auth
const authRoute = express.Router();

authRoute.get("/profile", jwtTokenMiddleware, AuthController.profile);
authRoute.post("/login", validator(authSchemas.login), AuthController.login);
authRoute.post("/register", validator(authSchemas.register), AuthController.register);
authRoute.put("/change-password", validator(authSchemas.changePassword), jwtTokenMiddleware, AuthController.changePassword);

export default authRoute;
