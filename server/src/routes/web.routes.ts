import express from 'express';

const webRouter = express.Router();

webRouter.get("/", (req: express.Request, res: express.Response) => {
  res.render("pages/index.ejs");
});

module.exports = webRouter;
