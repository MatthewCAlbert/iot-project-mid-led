import express from 'express';
import jwtTokenMiddleware from '../middlewares/jwttoken.middleware';

// Schedule Routes /api/schedule
const scheduleRouter = express.Router();
scheduleRouter.use(jwtTokenMiddleware);

// Schedule

// All Schedule List
scheduleRouter.get("/", null);

// Create new schedule
scheduleRouter.post("/", null);

// Cancel a schedule
scheduleRouter.delete("/:id", null);

export default scheduleRouter;
