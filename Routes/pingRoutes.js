import express from "express";  
import { pingUser } from "../controllers/PingController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const pingRouter = express.Router();

pingRouter.post("/", verifyToken, pingUser);

export default pingRouter;
