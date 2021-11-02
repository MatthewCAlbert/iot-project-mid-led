import express from 'express';
import ApiController from '../controllers/api.controller';
import jwtTokenMiddleware from '../middlewares/jwttoken.middleware';
import validator from '../middlewares/validator.middleware';
import apiSchemas from '../validations/api.validation';

// Schedule Routes /api/schedule
const scheduleRouter = express.Router();
scheduleRouter.use(jwtTokenMiddleware);

// Schedule

// All Schedule List
scheduleRouter.get("/", ApiController.allSchedule);

// Get a schedule detail
scheduleRouter.get("/:id", ApiController.getScheduleDetail);

// Create new schedule
scheduleRouter.post("/", validator(apiSchemas.addNewSchedule), ApiController.addNewSchedule);

// Cancel a schedule
scheduleRouter.delete("/:id", validator(apiSchemas.deleteSchedule), ApiController.deleteSchedule);

export default scheduleRouter;
