import express from "express";

const ApiController = {
  helloWorldHandler(req: express.Request, res: express.Response): void {
    res.status(200).json({message: "Hello World!"}); 
  },
  testAuth(req: express.Request, res: express.Response): void {

  },
  allUser(req: express.Request, res: express.Response): void {

  },
  clearDb(req: express.Request, res: express.Response) {
    res.sendStatus(403);
  }

}

export default ApiController;