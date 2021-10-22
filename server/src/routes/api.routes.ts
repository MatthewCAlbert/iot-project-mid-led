import express from 'express';
import ApiController from "../controllers/api.controller";
import AuthController from '../controllers/auth.controller';
import jwtTokenMiddleware from '../middlewares/jwttoken.middleware';

// General API Routes /api
const apiRouter = express.Router();

apiRouter.get("/", ApiController.helloWorldHandler);

apiRouter.get("/users", ApiController.allUser);
apiRouter.delete("/all", ApiController.clearDb);

apiRouter.get("/protected", jwtTokenMiddleware, ApiController.testAuth);

// Device Related
// apiRouter.get("/schedule/check", ApiController.allUser);
// apiRouter.post("/device/command", jwtTokenMiddleware, ApiController.allUser);

export default apiRouter;
