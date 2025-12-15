import {
  getAllGroups,
  createGroup,
  getGroupById,
  getMembersByGroup,
  isMember,
  deleteGroup,
  requestJoin,
  getPendingMembers,
  updateMembershipStatus,
  removeMember,
  isOwner
} from "../models/group_model.js";
import {
  updateGroupDescription,
  updateGroupSettings
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

    if (!ownerId)
      return res.status(401).json({ error: "Authentication required" });
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

    if (!userId)
      return res.status(401).json({ error: "Authentication required" });

    const group = await getGroupById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const member = await isMember(groupId, userId);
    const owner = group.owner_id === userId;
  
    let members = [];
    let pending = [];

    if (member || owner) {
      members = await getMembersByGroup(groupId);
    }

    if (owner) {
      pending = await getPendingMembers(groupId);
    }
    const suggestions = group.settings?.suggestedMovies || [];
    res.json({
      group,
      members,
      pending,
      isMember: member,
      isOwner: owner,
      suggestions
    });

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

export async function joinRequest(req, res, next) {
  try {
    const groupId = req.params.id;
    const userId = req.user?.user_id;

    if (!userId)
      return res.status(401).json({ error: "Authentication required" });

    const group = await getGroupById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const success = await requestJoin(groupId, userId);
    if (!success)
      return res.status(400).json({ error: "Request already exists" });

    res.json({ success: true, message: "Join request sent" });
  } catch (err) {
    next(err);
  }
}

export async function handleJoinRequest(req, res, next) {
  try {
    const groupId = req.params.id;
    const userId = req.params.userId;
    const ownerId = req.user?.user_id;
    const { action } = req.body; // "accept" | "reject"

    const isGroupOwner = await isOwner(groupId, ownerId);
    if (!isGroupOwner)
      return res.status(403).json({ error: "Only owner can manage requests" });

    if (action === "accept") {
      await updateMembershipStatus(groupId, userId, "accepted");
    } else if (action === "reject") {
      await removeMember(groupId, userId);
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function kickMember(req, res, next) {
  try {
    const groupId = req.params.id;
    const memberId = req.params.userId;
    const ownerId = req.user?.user_id;

    const isGroupOwner = await isOwner(groupId, ownerId);
    if (!isGroupOwner)
      return res.status(403).json({ error: "Only owner can remove members" });

    const success = await removeMember(groupId, memberId);
    res.json({ success });
  } catch (err) {
    next(err);
  }
}

export async function leaveGroup(req, res, next) {
  try {
    const groupId = req.params.id;
    const userId = req.user?.user_id;
    const owner = await isOwner(groupId, userId);

    if (owner)
      return res
        .status(403)
        .json({ error: "Owner cannot leave the group. Delete it instead." });
        
    const success = await removeMember(groupId, userId);
    res.json({ success });
  } catch (err) {
    next(err);
  }
}

export async function viewPendingRequests(req, res, next) {
  try {
    const groupId = req.params.id;
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const owner = await isOwner(groupId, userId);
    if (!owner) {
      return res
        .status(403)
        .json({ error: "Only owner can view pending requests" });
    }

    const pending = await getPendingMembers(groupId);

    res.json({
      group_id: groupId,
      pending_requests: pending,
    });
  } catch (err) {
    next(err);
  }
}
export async function setGroupDescription(req, res, next) {
  try {
    const groupId = req.params.id;
    const ownerId = req.user?.user_id;
    const { description } = req.body;

    if (!ownerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const updated = await updateGroupDescription(groupId, ownerId, description);
    if (!updated) {
      return res.status(403).json({ error: "Only owner can update description" });
    }

    res.json({ success: true, description: updated.description });
  } catch (err) {
    next(err);
  }
}
export async function setGroupSettings(req, res, next) {
  try {
    const groupId = req.params.id;
    const ownerId = req.user?.user_id;
    const settings = req.body; 

    if (!ownerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const updated = await updateGroupSettings(groupId, ownerId, settings);
    if (!updated) {
      return res.status(403).json({ error: "Only owner can update settings" });
    }

    res.json({ success: true, settings: updated.settings });
  } catch (err) {
    next(err);
  }
}