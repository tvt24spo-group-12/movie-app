import { useState } from "react";
import useDeleteUser from "../api/useDeleteUser";
import "../style/deleteuser.css";
import { useAuth } from "../context/login";

export default function DeleteUser({ open, onCancel }) {
  const [confirmation, setConfirmation] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [verify, setVerify] = useState("")
  const deleteUser = useDeleteUser();
  const { user, logout } = useAuth();

  if (!open) return null;

  function onConfirm() {
    onCancel(); 
  }



  return (
    <div className="del-backdrop">
      <div className="del-modal">
        
        {deleted ? (
    
          <>
            <div className="del-icon">✔️</div>
            <h2 className="del-title">Account Deleted</h2>
            <p className="del-text">
              Your account has been permanently deleted.
              <br />
              You have been logged out.
            </p>

            <button className="del-btn del-btn-secondary" onClick={onConfirm}>
              Close
            </button>
          </>
        ) : (
        
          <>
            <div className="del-icon">🗑️</div>

            <h2 className="del-title">Delete Account</h2>

            <p className="del-text">
              Are you sure you want to delete the account linked to
              <br />
              <strong>{user.email}</strong>?
            </p>
            <p className="del-text">Type {user.email} to delete.</p>
            <label className="del-checkbox">
              <input
                type="text"
                onChange={(e)=> {
                  setConfirmation(e.target.value === user.email);
                }

                }
              />
              <span>
                I understand that I won't be able to recover my account.
              </span>
            </label>

            <div className="del-actions">
              <button
                className="del-btn del-btn-danger"
                disabled={!confirmation}
                onClick={async () => {
                  try {
                    await deleteUser(user.id); 
                    await logout();            
                    setDeleted(true);          
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Delete
              </button>

              <button className="del-btn del-btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}