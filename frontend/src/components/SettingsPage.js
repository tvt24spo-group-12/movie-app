import { useEffect, useState } from "react";
import "../style/global.css";
import "../style/SettingsPage.css";
import { useAuth } from "../context/login";
import DeleteUser from "./DeleteUser";
import Toast from "./Toast";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
export default function SettingsPage({ isOpen, onClose }) {
  const { user, authFetch } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  if (!isOpen) return null;

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("The passwords don't match.", "error");
      return;
    }
    /*
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters long!", "error");
      return;
    }
    */
    const data = { oldPassword: currentPassword, newPassword: newPassword };

    const res = await authFetch(`${API_URL}/user/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    showToast(
      res.ok ? "Password changed successfully!" : "Failed to change password.",
      res.ok ? "success" : "error"
    );
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h1 className="settings-title">Account Settings</h1>
          <button className="settings-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-content">
          {/* User info */}
          <section className="user-info-section">
            <h2 className="section-title">User Information</h2>
            <div className="info-row">
              <label className="info-label">Username:</label>
              <span className="info-value">{user?.username || "-"}</span>
            </div>
            <div className="info-row">
              <label className="info-label">Email:</label>
              <span className="info-value">{user?.email || "-"}</span>
            </div>
          </section>

          {/* Password */}
          <section className="password-section">
            <h2 className="section-title">Change Password</h2>
            <div className="password-form">
              <input
                type="password"
                placeholder="Current Password"
                className="input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="btn-primary password-btn"
                onClick={handleChangePassword}
              >
                Update Password
              </button>
            </div>
          </section>

          {/* Delete */}
          <section className="delete-section">
            <h2 className="delete-title">Delete Account</h2>
            <p className="delete-warning">Warning: This action is permanent.</p>
            <button
              className="delete-btn"
              onClick={() => setIsDeleteOpen(true)}
            >
              Permanently delete account
            </button>
          </section>
        </div>
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <DeleteUser
        open={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onDeleted={() => {
          setIsDeleteOpen(false);
          onClose();
        }}
      />
      
    </div>
  );
}
