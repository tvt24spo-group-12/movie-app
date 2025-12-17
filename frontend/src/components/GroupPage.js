import { useEffect, useState } from "react";
import { useAuth } from "../context/login";
import { getGroups, createGroup } from "../api/group";
import SearchBar from "../components/SearchBar";
import {
  requestJoin,
  leaveGroup,
  getGroupMembers,
  getPending,
  handleJoin,
  kickMember,
  deleteGroup,
  updateDescription,
  updateSettings

} from "../api/group";
import "../style/GroupPage.css";
import "../style/global.css";
import MovieCarousel from "../components/MovieCarousel";
import { searchMovies } from "../api/movies";


export default function GroupPage() {

  //staattiset muuttujat
const { user, authFetch } = useAuth();
const [groups, setGroups] = useState([]);
const [name, setName] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [showCreate, setShowCreate] = useState(false);
const [selectedGroup, setSelectedGroup] = useState(null);
const [tempSettings, setTempSettings] = useState({
  bannerColor: "var(--surface)",
  textColor: "var(--text)",
  showMembers: true,
  layout: "wide"
});
const [members, setMembers] = useState([]);
const [pending, setPending] = useState([]);
const [myGroupIds, setMyGroupIds] = useState([]);
const [showDetails, setShowDetails] = useState(false);
const [suggested, setSuggested] = useState([]);
const [tmdbSearch, setTmdbSearch] = useState("");
const [tmdbResults, setTmdbResults] = useState([]);

const userId = user ? (user.user_id ?? user.id ?? null) : null;

const currentUserId =
  userId != null
    ? Number(userId)
    : null;

const myGroups = groups.filter(g => myGroupIds.includes(g.group_id));
const otherGroups = groups.filter(g => !myGroupIds.includes(g.group_id));

async function searchTmdb(query) {
  if (!query.trim()) {
    setTmdbResults([]);
    return;
  }

  try {
    const results = await searchMovies(query);
    setTmdbResults(results);
  } catch (err) {
    console.error("TMDB search failed", err);
    setTmdbResults([]);
  }
}
async function openGroup(group) {
  try {
    const result = await getGroupMembers(group.group_id, authFetch);
    const safeGroup = {
      ...result.group,
      description: result.group.description || "",
      settings: {
        bannerColor: result.group.settings?.bannerColor || "var(--surface)",
        textColor: result.group.settings?.textColor || "var(--text)",
        showMembers: result.group.settings?.showMembers ?? true,
        layout: result.group.settings?.layout || "wide"
      }
    };

    setSelectedGroup(safeGroup);

    // hyväksytyt jäsenet
    const acceptedMembers = result.members.filter(
      m => m.membership_status === "accepted"
    );
    setMembers(acceptedMembers);

    setSuggested(
  Array.isArray(result.group.settings?.suggestedMovies)
    ? result.group.settings.suggestedMovies
    : []
);
    // pending näkyy vain adminille
    if (isAdmin(safeGroup)) {
      setPending(result.pending || []);
    } else {
      setPending([]);
    }

    setShowDetails(false);

  } catch (err) {
    console.error(err);
  }
}
function isMemberOfGroup(group, members, currentUserId) {
  return members.some(m => Number(m.user_id) === Number(currentUserId));
}

function canViewDetails(group, members, currentUserId) {
  return isAdmin(group) || isMemberOfGroup(group, members, currentUserId);
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
      user && (user.user_id ?? user.id) != null
        ? Number(user.user_id ?? user.id)
        : null;

    if (!currentUserIdLocal) {
      setMyGroupIds([]);
      return;
    }

    const myIds = [];

    // async for of toimii aina
    for (const g of all) {

      // olet ryhmän omistaja
      if (Number(g.owner_id) === currentUserIdLocal) {
        myIds.push(g.group_id);
        continue;
      }

      try {
        const detail = await getGroupMembers(g.group_id, authFetch);

        if (detail.isMember || detail.isOwner) {
          myIds.push(g.group_id);
        }

      } catch (err) {
        console.error("group fetch failed", g.group_id, err);
      }
    }

    setMyGroupIds(myIds);

  } catch (err) {
    console.error(err);
    setError("Group loading failed.");
  } finally {
    setLoading(false);
  }
}
async function addSuggestedMovie(movie) {
  if (suggested.some(m => Number(m.id) === Number(movie.id))) {
    alert("This movie is already added.");
    return;
  }

  const newMovie = {
    id: movie.id,
    title: movie.title,
    poster: movie.poster || (movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
      : null)
  };

  const updated = [...suggested, newMovie];
  setSuggested(updated);

  await updateSettings(
    selectedGroup.group_id,
    {
      ...selectedGroup.settings,
      suggestedMovies: updated
    },
    authFetch
  );
}
async function handleRemoveSuggestion(id) {
  const updated = suggested.filter(m => Number(m.id) !== Number(id));

  setSuggested(updated);

  await updateSettings(
    selectedGroup.group_id,
    {
      ...selectedGroup.settings,
      suggestedMovies: updated
    },
    authFetch
  );
}

      //handlerit
async function saveGroupSettings() {
  try {
    await updateDescription(
      selectedGroup.group_id,
      selectedGroup.description,
      authFetch
    );

    const newSettings = {
      ...selectedGroup.settings,
      suggestedMovies: suggested
    };

    await updateSettings(
      selectedGroup.group_id,
      newSettings,
      authFetch
    );

    alert("Settings saved.");
  } catch (err) {
    console.error(err);
    alert("Failed to save settings.");
  }
}

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

  {/* BANNER */}

  {selectedGroup && (
    <div
      className="group-banner"
      style={{
        background: selectedGroup.settings?.bannerColor || "var(--surface)",
        color: selectedGroup.settings?.textColor || "var(--text)"
      }}
    >
      <h1 className="group-banner-title">
        {Array.isArray(selectedGroup.group_name)
          ? selectedGroup.group_name.join(", ")
          : selectedGroup.group_name}
      </h1>

      {selectedGroup.description && (
        <p className="group-description">
          {selectedGroup.description}
        </p>
      )}

      {/* SUGGESTED MOVIES CAROUSEL BANNERIN SISÄLLÄ*/}

  {selectedGroup && suggested.length > 0 && (
    <div className="suggested-box">
      <h2>Suggested Movies</h2>
      <MovieCarousel movies={suggested} />
    </div>
  )}

    </div>
  )}

  
  {/* EI VALITTUA RYHMÄÄ */}

  {!selectedGroup && <p>Click a group</p>}

  {/* GROUP DETAILS OMAAN LAATIKKOON */}

  {selectedGroup && (
    <div className="card">

      {/* JOIN BUTTON */}

      {!isAdmin(selectedGroup) &&
        !isMemberOfGroup(selectedGroup, members, currentUserId) && (
          <button className="btn-primary" onClick={handleJoinGroup}>
            Join group
          </button>
      )}

      {/* DETAILS TOGGLE */}
      <h2
        className="group-details-toggle"
        onClick={() => {
          if (canViewDetails(selectedGroup, members, currentUserId)) {
            setShowDetails(v => !v);
          } else {
            alert("Only members can view details.");
          }
        }}
      >
        Group Details ⬇
      </h2>

      {/* ADMIN SETTINGS AREA */}

      {isAdmin(selectedGroup) && showDetails && (
        <div className="admin-edit-box">

          <label>Description</label>
          <textarea
           className="group-textarea"
            value={selectedGroup.description || ""}
            onChange={e =>
              setSelectedGroup(prev => ({
                ...prev,
                description: e.target.value
              }))
            }
          />

          <label>Banner color</label>
          <input
            type="color"
            value={selectedGroup.settings?.bannerColor || "var(--surface)"}
            onChange={e =>
              setSelectedGroup(prev => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  bannerColor: e.target.value
                }
              }))
            }
          />

          <label>Text color</label>
          <input
            type="color"
            value={selectedGroup.settings?.textColor || "var(--text)"}
            onChange={e =>
              setSelectedGroup(prev => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  textColor: e.target.value
                }
              }))
            }
          />

          <button className="btn-success" onClick={saveGroupSettings}>
            Save changes
          </button>
        </div>
      )}

      {/* DETAILS CONTENT */}

      {showDetails && (
        <>

          <p>Member count - {members.length}</p>

          {!isAdmin(selectedGroup) &&
            members.some(m => m.user_id === currentUserId) && (
              <button className="btn-danger" onClick={handleLeaveGroup}>
                Leave group
              </button>
          )}

          {isAdmin(selectedGroup) && (
            <button className="btn-danger" onClick={handleDeleteGroup}>
              Delete group
            </button>
          )}

          <h4>Members</h4>
          {members.map(m => (
            <div key={m.user_id} className="member-row">
              <span>
                {m.username}
                {m.user_id === currentUserId && " (YOU)"}
                {m.user_id === selectedGroup.owner_id && (
                  <span className="admin-badge">Admin</span>
                )}
              </span>

              {isAdmin(selectedGroup) && m.user_id !== currentUserId && (
                <button
                  className="btn-danger"
                  onClick={() => {
                    const ok = window.confirm(`Remove ${m.username}?`);
                    if (!ok) return;
                    handleKick(m.user_id);
                  }}
                >
                  Kick
                </button>
              )}
            </div>
          ))}

          {/* Pending */}

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

          {/* SUGGESTED LIST */}
      {isAdmin(selectedGroup) && (
          <h3>Suggested movies</h3>
          )}
          {suggested.length === 0 && <p>No suggestions yet.</p>}
        {isAdmin(selectedGroup) && (
          <div className="suggested-list">
            {suggested.map(movie => (
              <div key={movie.id} className="suggested-list-row">
                <span className="suggested-title">{movie.title}</span>

               
                  <button
                    className="btn-danger"
                    onClick={() => handleRemoveSuggestion(movie.id)}
                  >
                    Remove
                  </button>
               
              </div> 
            ))}
          </div>
          )}

          {/* TMDB SEARCH */}

          {(isAdmin(selectedGroup) || isMemberOfGroup(selectedGroup, members, currentUserId)) && (
          <div className="tmdb-search-box">
              <h3>Search for movies</h3>
              <label>Added movies will be shown on group page</label>

              <SearchBar
                value={tmdbSearch}
                onChange={(value) => {
                  setTmdbSearch(value);
                  searchTmdb(value);
                }}
                placeholder="Search movies..."
              />

              {tmdbResults.length > 0 && (
                <div className="tmdb-results">
                  {tmdbResults.map(movie => (
                    <div key={movie.id} className="tmdb-result-card">
                      <img src={movie.poster} alt={movie.title} />
                      <div>
                        <p>{movie.title}</p>
                        <button
                          className="btn-success"
                          onClick={() => addSuggestedMovie(movie)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </>
      )}

    </div>
  )}

    </div>
    </div>
    </div>
  );
}          
