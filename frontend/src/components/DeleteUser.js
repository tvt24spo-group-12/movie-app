import { useState } from "react";
import deleteUser from "../api/deleteUser";
import "../style/deleteuser.css";
import { useAuth } from "../context/login";

export default function DeleteUser({open, onConfirm, onCancel }) {
  const [confirmation, setConfirmation] = useState(false);
  const {user} = useAuth();
  console.log("User:", user);

  if (!open || !user) return null;

  return (
    <div className="del-backdrop">
      <div className="del-modal">
        <div className="del-icon">🗑️</div>

        <h2 className="del-title">Delete Account</h2>

        <p className="del-text">
          Are you sure you want to delete the account linked to
          <br />
          <strong>{user.email}</strong>?
        </p>

        <label className="del-checkbox">
          <input
            type="checkbox"
            checked={confirmation}
            onChange={(e) => setConfirmation(e.target.checked)}
          />
          <span>I understand that I won't be able to recover my account.</span>
        </label>

        <div className="del-actions">
          <button
            className="del-btn del-btn-danger"
            disabled={!confirmation}
            onClick={() => {
              deleteUser(user.id).then(onConfirm).catch(console.error);
            }}
          >
            Delete
          </button>

          <button className="del-btn del-btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
