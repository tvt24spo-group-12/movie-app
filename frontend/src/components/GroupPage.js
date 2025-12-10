import { useEffect, useState } from "react";
import { useAuth } from "../context/login";
import { getGroups, createGroup } from "../api/group";
import {
  requestJoin,
  leaveGroup,
  getGroupMembers,
  getPending,
  handleJoin,
  kickMember,
  deleteGroup
} from "../api/group";
import "../style/GroupPage.css";
import "../style/global.css";


export default function GroupPage() {

  //staattiset muuttujat
const { user, authFetch } = useAuth();
const [groups, setGroups] = useState([]);
const [name, setName] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [showCreate, setShowCreate] = useState(false);
const [selectedGroup, setSelectedGroup] = useState(null);
const [members, setMembers] = useState([]);
const [pending, setPending] = useState([]);
const [myGroupIds, setMyGroupIds] = useState([]);


const userId = user ? (user.user_id ?? user.id ?? null) : null;

const currentUserId =
  userId != null
    ? Number(userId)
    : null;

const myGroups = groups.filter(g => myGroupIds.includes(g.group_id));
const otherGroups = groups.filter(g => !myGroupIds.includes(g.group_id));

async function openGroup(group) {
  setSelectedGroup(group);

  try {
    const data = await getGroupMembers(group.group_id, authFetch);
    const accepted = data.filter(
      m =>
        m.membership_status === "accepted"
    );

setMembers(accepted);

    if (isAdmin(group)) {
      const p = await getPending(group.group_id, authFetch);
      setPending(p.pending_requests || []);
    } else {
      setPending([]);
    }
  } catch (err) {
    console.error(err);
  }
}

function isAdmin(group) {
  if (!group || currentUserId == null) return false;
  return Number(group.owner_id) === currentUserId;
}
async function loadGroups() {
  try {
    setLoading(true);
    setError("");

    const all = await getGroups();
    setGroups(all);

    const currentUserIdLocal =
      user && (user.user_id ?? user.id ?? null) != null
        ? Number(user.user_id ?? user.id)
        : null;

    if (currentUserIdLocal != null) {
      const myIds = [];

      for (const g of all) {
        // jos olet omistaja, ryhmää suoraan mukana
        if (Number(g.owner_id) === currentUserIdLocal) {
          myIds.push(g.group_id);
          continue;
        }

        // muuten tarkistetaan jäsenyys
        try {
          const data = await getGroupMembers(g.group_id, authFetch);
          const accepted = data.filter(
            m => m.membership_status === "accepted"
          );

          if (accepted.some(m => Number(m.user_id) === currentUserIdLocal)) {
            myIds.push(g.group_id);
          }
        } catch (err) {
          console.error("member fetch failed for group", g.group_id, err);
        }
      }

      setMyGroupIds(myIds);
    } else {
      setMyGroupIds([]);
    }
  } catch (err) {
    console.error(err);
    setError("Group loading failed.");
  } finally {
    setLoading(false);
  }
}
      //handlerit
  async function handleCreate() {
    if (!user) {
      alert("Log in first.");
      return;
    }

    if (!name.trim()) {
      alert("Name is required.");
      return;
    }

    try {
      await createGroup(name, authFetch);
      setName("");
      loadGroups();
    } catch (err) {
      console.error(err);
      alert("Group creation failed.");
    }
  }
async function handleJoinGroup() {
  try {
    await requestJoin(selectedGroup.group_id, authFetch);
    alert("Join request sent.");
  } catch (err) {
    alert("Join failed.");
  }
}

async function handleLeaveGroup() {
  try {
    await leaveGroup(selectedGroup.group_id, authFetch);
    await loadGroups();
    setSelectedGroup(null);
  } catch (err) {
    alert("Failed to leave.");
  }
}

async function handleAccept(userId) {
  await handleJoin(selectedGroup.group_id, userId, "accept", authFetch);
  openGroup(selectedGroup);
}

async function handleReject(userId) {
  await handleJoin(selectedGroup.group_id, userId, "reject", authFetch);
  openGroup(selectedGroup);
}

async function handleKick(userId) {
  await kickMember(selectedGroup.group_id, userId, authFetch);
  openGroup(selectedGroup);
}

async function handleDeleteGroup() {
  const ok = window.confirm("Delete this group?");
  if (!ok) return;
  await deleteGroup(selectedGroup.group_id, authFetch);
  setSelectedGroup(null);
  await loadGroups();
}


  useEffect(() => {
    loadGroups();
  }, []);
  useEffect(() => {
  if (userId == null) return;   // ei tehdä mitään jos ei ole käyttäjää
  loadGroups();
}, [userId]); 

  return (
    <div className="groupPage-wide">
      <div className="group-layout">

        <div className="group-list">
          <h2>Groups</h2>
          
            <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
              Create group
            </button>

            {showCreate && (
              <div className="create-group-box">

                <h2>New group</h2>

                <input
                  type="text"
                  placeholder="Group name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />

                <div className="create-actions">
                  <button className="btn-success" onClick={handleCreate}>
                    Create
                  </button>

                  <button className="btn-danger" onClick={() => setShowCreate(false)}>
                    Cancel
                  </button>
                </div>

              </div>
            )}

          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}

          {!loading && groups.length === 0 && <p>No groups</p>}
            <h3>My groups</h3>

            {myGroups.length === 0 && <p>No groups</p>}

             {myGroups.map(g => (
            <div
              key={g.group_id}
              className="group-item group-link"
              onClick={() => openGroup(g)}
            >
              {Array.isArray(g.group_name) ? g.group_name.join(", ") : g.group_name}

              {isAdmin(g) && (
                <span className="admin-badge">Admin</span>
              )}
            </div>
          ))}
                      
            {selectedGroup && isAdmin(selectedGroup) && (
            <p className="admin-label">You are admin of this group</p>
             )}  

            <h3>All groups</h3>

            {otherGroups.length === 0 && <p>No other groups</p>}

            {otherGroups.map(g => (
              <div
                key={g.group_id}
                className="group-item group-link"
                onClick={() => openGroup(g)}
              >
                {Array.isArray(g.group_name) ? g.group_name.join(", ") : g.group_name}
              </div>
            ))}
          
        </div>
          <div className="group-view">

        {!selectedGroup && <p>Click a group</p>}

          {selectedGroup && (
            <div className="card">
              <h2>{Array.isArray(selectedGroup.group_name)
                ? selectedGroup.group_name.join(", ")
                : selectedGroup.group_name}</h2>

              <p>Members - {members.length}</p>

              {!isAdmin(selectedGroup) && !members.some(m => m.user_id === currentUserId) && (
                <button className="btn-primary" onClick={() => handleJoinGroup()}>
                  Join group
                </button>
              )}

              {!isAdmin(selectedGroup) && members.some(m => m.user_id === currentUserId) && (
                <button className="btn-danger" onClick={() => handleLeaveGroup()}>
                  Leave group
                </button>
              )}

              {isAdmin(selectedGroup) && (
                <button className="btn-danger" onClick={() => handleDeleteGroup()}>
                  Delete group
                </button>
              )}

                           
                  <p>Members - {members.length}
                  </p>
                  {isAdmin(selectedGroup) && (
                    <>
                      <h4>Members</h4>
                      {members.map(m => (
                        <div key={m.user_id}>
                          {m.username}
                          {m.user_id === currentUserId && " (YOU)"}
                          {m.user_id !== currentUserId && (
                          
                            <button
                              className="btn-danger"
                              onClick={() => handleKick(m.user_id)}
                            >
                              Kick
                            </button>
                          )}
                        </div>
                      ))}
                    </>
                  )}
              {isAdmin(selectedGroup) && (
                <>
                  <h4>Pending requests</h4>

                  {pending.map(p => (
                    <div key={p.user_id}>
                      {p.username}
                      <button
                        className="btn-success"
                        onClick={() => handleAccept(p.user_id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleReject(p.user_id)}
                      >
                        Reject
                      </button>
                    </div>
                  ))}
                </>
              )}
          </div>
        )}
          </div>

      </div>
    </div>
  );
}
