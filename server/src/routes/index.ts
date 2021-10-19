import express from 'express';
import apiRouter from "./api.routes";
import authRoute from "./auth.routes";
import scheduleRouter from "./schedule.routes";
import webRouter from './web.routes';

const apiRoutes = [
  {
    path: '',
    version: "1",
    router: apiRouter,
  },
  {
    path: 'auth',
    version: "1",
    router: authRoute,
  },
  // {
  //   path: 'schedule',
  //   version: "1",
  //   router: scheduleRouter,
  // }
];

const webRoutes = [
  {
    path: '',
    router: webRouter
  }
];

const router = express.Router();

apiRoutes.forEach((route)=>{
    router.use(`/api/v${route.version}/${route.path}`, route.router);
})

webRoutes.forEach((route)=>{
    router.use(`/${route.path}`, route.router);
})

export default router;