import pool from "../database.js";

export async function getAllGroups() {
  const res = await pool.query(
    `SELECT group_id, group_name, owner_id, user_amount 
     FROM groups`
  );
  return res.rows;
}

export async function createGroup(name, ownerId) {
  const result = await pool.query(
    `INSERT INTO groups (group_name, owner_id, user_amount)
     VALUES ($1, $2, 1)
     RETURNING group_id`,
    [[name], ownerId]
  );

  const newGroupId = result.rows[0].group_id;

  await pool.query(
    `INSERT INTO group_members (group_id, user_id, membership_status)
     VALUES ($1, $2, 'accepted')`,
    [newGroupId, ownerId]
  );

  return newGroupId;
}

export async function getGroupById(groupId) {
  const res = await pool.query(`SELECT * FROM groups WHERE group_id=$1`, [
    groupId,
  ]);
  return res.rows[0];
}

export async function getMembersByGroup(groupId) {
  const res = await pool.query(
    `SELECT u.user_id, u.username, gm.membership_status
     FROM group_members gm
     JOIN users u ON u.user_id = gm.user_id
     WHERE gm.group_id = $1`,
    [groupId]
  );

  return res.rows;
}

export async function isMember(groupId, userId) {
  if (!userId) return false;

  const result = await pool.query(
    `SELECT 1 FROM group_members 
     WHERE group_id=$1 
     AND user_id=$2 
     AND membership_status='accepted'`,
    [groupId, userId]
  );

  return result.rowCount > 0;
}

export async function deleteGroup(groupId, ownerId) {
  const deleteMembers = await pool.query(
    "DELETE FROM group_members WHERE group_id=$1",
    [groupId]
  );

  const result = await pool.query(
    `DELETE FROM groups 
     WHERE group_id=$1 AND owner_id=$2 
     RETURNING group_id`,
    [groupId, ownerId]
  );
  return result.rowCount > 0;
}

export async function requestJoin(groupId, userId) {
  const exists = await pool.query(
    "SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2",
    [groupId, userId]
  );

  if (!exists.rowCount) {
    const result = await pool.query(
      "INSERT INTO group_members (group_id, user_id, membership_status) VALUES ($1, $2, 'pending')",
      [groupId, userId]
    );
     return result.rowCount > 0;
  }
 
}

export async function getPendingMembers(groupId) {
  const res = await pool.query(
    `SELECT u.user_id, u.username, gm.membership_status
     FROM group_members gm
     JOIN users u ON u.user_id = gm.user_id
     WHERE gm.group_id=$1 AND gm.membership_status='pending'`,
    [groupId]
  );
  return res.rows;
}

export async function updateMembershipStatus(groupId, userId, status) {
  const result = await pool.query(
    `UPDATE group_members
     SET membership_status=$3
     WHERE group_id=$1 AND user_id=$2
     RETURNING group_id`,
    [groupId, userId, status]
  );
  return result.rowCount > 0;
}

export async function removeMember(groupId, userId) {
  const result = await pool.query(
    `DELETE FROM group_members 
     WHERE group_id=$1 AND user_id=$2
     RETURNING user_id`,
    [groupId, userId]
  );
  return result.rowCount > 0;
}

export async function isOwner(groupId, userId) {
  const result = await pool.query(
    `SELECT 1 FROM groups 
     WHERE group_id=$1 AND owner_id=$2`,
    [groupId, userId]
  );
  return result.rowCount > 0;
}
export async function updateGroupDescription(groupId, ownerId, description) {
  const sql = `
    UPDATE groups
    SET description = $1
    WHERE group_id = $2 AND owner_id = $3
    RETURNING *;
  `;
  const result = await pool.query(sql, [description, groupId, ownerId]);
  return result.rows[0];
}
export async function updateGroupSettings(groupId, ownerId, settings) {
  const sql = `
    UPDATE groups
    SET settings = $1
    WHERE group_id = $2 AND owner_id = $3
    RETURNING *;
  `;
  const result = await pool.query(sql, [settings, groupId, ownerId]);
  return result.rows[0];
}