import pool from "../database.js";

export async function getAllGroups() {
  const res = await pool.query(
    `SELECT group_id, group_name, owner_id, user_amount 
     FROM groups`
  );
  return res.rows;
}

export async function createGroup(name, ownerId) {
  // group_name on VARCHAR[] — tallennetaan taulukoksi
  const result = await pool.query(
    `INSERT INTO groups (group_name, owner_id, user_amount)
     VALUES ($1, $2, 1)
     RETURNING group_id`,
    [[name], ownerId]
  );

  const newGroupId = result.rows[0].group_id;

  // lisää omistaja jäseneksi
  await pool.query(
    `INSERT INTO group_members (group_id, user_id, membership_status)
     VALUES ($1, $2, 'accepted')`,
    [newGroupId, ownerId]
  );

  return newGroupId;
}

export async function getGroupById(groupId) {
  const res = await pool.query(
    `SELECT * FROM groups WHERE group_id=$1`,
    [groupId]
  );
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
  const result = await pool.query(
    `DELETE FROM groups 
     WHERE group_id=$1 AND owner_id=$2 
     RETURNING group_id`,
    [groupId, ownerId]
  );
  return result.rowCount > 0;
}