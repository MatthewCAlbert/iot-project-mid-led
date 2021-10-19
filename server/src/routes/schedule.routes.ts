import express from 'express';
import jwtTokenMiddleware from '../middlewares/jwttoken.middleware';

// Schedule Routes /api/schedule
const scheduleRouter = express.Router();
scheduleRouter.use(jwtTokenMiddleware);

// Schedule
scheduleRouter.get("/schedule", jwtTokenMiddleware, null);
scheduleRouter.get("/schedule", jwtTokenMiddleware, null);

export default scheduleRouter;
