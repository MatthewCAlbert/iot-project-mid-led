import express from 'express';
import helmet from 'helmet';

const webRouter = express.Router();
webRouter.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

webRouter.get("/", (req: express.Request, res: express.Response) => {
  res.render("pages/index.ejs");
});

webRouter.get("/schedule", (req: express.Request, res: express.Response) => {
  res.render("pages/schedule.ejs");
});

export default webRouter;
