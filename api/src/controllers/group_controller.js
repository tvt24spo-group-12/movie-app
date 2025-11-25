import {
  getAllGroups,
  createGroup,
  getGroupById,
  getMembersByGroup,
  isMember,
  deleteGroup,
} from "../models/group_model.js";

export async function listGroups(req, res, next) {
  try {
    const groups = await getAllGroups();
    res.json(groups);
  } catch (err) {
    next(err);
  }
}

export async function createNewGroup(req, res, next) {
  try {
    const { name } = req.body;

    const ownerId = req.user?.user_id;

    if (!ownerId) return res.status(401).json({ error: "Authentication required" });
    if (!name) return res.status(400).json({ error: "Group name is required" });

    const groupId = await createGroup(name, ownerId);
    res.status(201).json({ success: true, group_id: groupId });
  } catch (err) {
    next(err);
  }
}

export async function viewGroup(req, res, next) {
  try {
    const groupId = req.params.id;
    const userId = req.user?.user_id;

    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const group = await getGroupById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const member = await isMember(groupId, userId);

    if (!member && group.owner_id !== userId)
      return res.status(403).json({ error: "Not allowed" });

 
    const members = await getMembersByGroup(groupId);
    res.json(members);
  } catch (err) {
    next(err);
  }
}

export async function removeGroup(req, res, next) {
  try {
    const groupId = req.params.id;
    const ownerId = req.user?.user_id;

    const deleted = await deleteGroup(groupId, ownerId);

    if (!deleted)
      return res.status(403).json({ error: "Only the owner can delete group" });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}