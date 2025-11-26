import { Router } from "express";
import {
  listGroups,
  createNewGroup,
  viewGroup,
  removeGroup,
  joinRequest,
  handleJoinRequest,
  kickMember,
  leaveGroup,
  viewPendingRequests,
} from "../controllers/group_controller.js";
import { authenticateToken } from "../middleware/auth.js";

const groupRouter = Router();

groupRouter.get("/", listGroups);
groupRouter.post("/", authenticateToken, createNewGroup);
groupRouter.get("/:id", authenticateToken, viewGroup);
groupRouter.delete("/:id", authenticateToken, removeGroup);
groupRouter.post("/:id/join", authenticateToken, joinRequest);
groupRouter.post("/:id/join/:userId", authenticateToken, handleJoinRequest);
groupRouter.post("/:id/kick/:userId", authenticateToken, kickMember);
groupRouter.post("/:id/leave", authenticateToken, leaveGroup);
groupRouter.get("/:id/requests", authenticateToken, viewPendingRequests);

export default groupRouter;
