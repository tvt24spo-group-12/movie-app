import { Router } from "express";
import {
  listGroups,
  createNewGroup,
  viewGroup,
  removeGroup,
} from "../controllers/group_controller.js";
import { authenticateToken } from "../middleware/auth.js";

const groupRouter = Router();

groupRouter.get("/", listGroups);
groupRouter.post("/", authenticateToken, createNewGroup);
groupRouter.get("/:id", authenticateToken, viewGroup);
groupRouter.delete("/:id", authenticateToken, removeGroup);


export default groupRouter;
