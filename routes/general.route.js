import { Router as generalRouter } from "express";
import generalController from '../controllers/general.controller';

const generalRouter = express.Router();

generalRouter.get("/general/getUserNames", generalController.getUserNames);

export default generalRouter;
