import express from 'express';
import ApiController from "../controllers/api.controller";
import AuthController from '../controllers/auth.controller';
import {validator} from '../middlewares/validator';
import authSchemas from '../validations/auth.validation';
import noteSchemas from '../validations/note.validation';

const apiRouter = express.Router();

apiRouter.get("/", ApiController.helloWorldHandler);

apiRouter.get("/users", ApiController.allUser);
apiRouter.delete("/all", ApiController.clearDb);
// apiRouter.get("/clearToken", ApiController.getClearDbToken);

apiRouter.get("/protected", passportOption, ApiController.testAuth);

apiRouter.get("/auth/check", passportOption, AuthController.check);
apiRouter.post("/login", validator(authSchemas.login), AuthController.login);
// apiRouter.post("/logout", AuthController.logout);
apiRouter.post("/register", validator(authSchemas.register), AuthController.register);
apiRouter.put("/users/change-password", validator(authSchemas.changePassword), passportOption, AuthController.changePassword);
apiRouter.delete("/user/:username", AuthController.destory);

// Note Routes
apiRouter.get("/notes/all", passportOption, NoteController.all);
apiRouter.post("/notes", validator(noteSchemas.note), passportOption, NoteController.create);

apiRouter.get("/notes/:id", passportOption, NoteController.show);
apiRouter.delete("/notes/:id", passportOption, NoteController.destroy);
apiRouter.put("/notes/:id", validator(noteSchemas.note), passportOption, NoteController.update);

module.exports = apiRouter;
