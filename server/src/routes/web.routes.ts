import express from 'express';

const webRouter = express.Router();

webRouter.get("/", (req: express.Request, res: express.Response) => {
  res.render("pages/index.ejs");
});

export default webRouter;
