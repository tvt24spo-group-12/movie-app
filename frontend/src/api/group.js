const API = "http://localhost:3001";

export async function getGroups() {
  const res = await fetch(`${API}/group/`);
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
}

export async function createGroup(name, authFetch) {
  const res = await authFetch(`${API}/group/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error("Failed to create group");
  return res.json();
}

export async function requestJoin(groupId, authFetch) {
  const res = await authFetch(`${API}/group/${groupId}/join`, {
    method: "POST"
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Join failed");
  }
  return res.json();
}

export async function leaveGroup(groupId, authFetch) {
  const res = await authFetch(`${API}/group/${groupId}/leave`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Leave failed");
  return res.json();
}

export async function getGroupMembers(groupId, authFetch) {
  const res = await authFetch(`${API}/group/${groupId}`);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}

export async function getPending(groupId, authFetch) {
  const res = await authFetch(`${API}/group/${groupId}/requests`);
  if (!res.ok) throw new Error("Failed to fetch pending");
  return res.json();
}

export async function handleJoin(groupId, userId, action, authFetch) {
  const res = await authFetch(`${API}/group/${groupId}/join/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action })
  });
  if (!res.ok) throw new Error("Failed to handle request");
  return res.json();
}

export async function kickMember(groupId, userId, authFetch) {
  const res = await authFetch(`${API}/group/${groupId}/kick/${userId}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to kick");
  return res.json();
}

export async function deleteGroup(groupId, authFetch) {
  const res = await authFetch(`${API}/group/${groupId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}
export async function updateDescription(groupId, description, authFetch) {
  const res = await authFetch(`${API}/group/${groupId}/description`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description })
  });

  if (!res.ok) throw new Error("Description update failed");
  return res.json();
}
export async function updateSettings(groupId, settings, authFetch) {
  const res = await authFetch(`${API}/group/${groupId}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings)
  });

  if (!res.ok) throw new Error("Settings update failed");
  return res.json();
}
export async function deleteSuggestedMovie(groupId, suggestionId, authFetch) {
  const res = await authFetch(`/group/${groupId}/suggested/${suggestionId}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Failed to delete suggestion");
  }

  return res.json();
}