"use client";
import * as React from "react";
import { Dialog } from "@headlessui/react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  "Account & Privacy",
  "Preferences",
  "Accessibility",
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const router = useRouter();

  // Add new state for preferences
  const [autoSaveDrafts, setAutoSaveDrafts] = React.useState(false);
  const [defaultFlag, setDefaultFlag] = React.useState("normal");

  // Add useEffect to load preferences
  React.useEffect(() => {
    // Load preferences from localStorage
    const savedAutoSave = localStorage.getItem("autoSaveDrafts");
    const savedDefaultFlag = localStorage.getItem("defaultFlag");
    
    if (savedAutoSave) setAutoSaveDrafts(savedAutoSave === "true");
    if (savedDefaultFlag) setDefaultFlag(savedDefaultFlag);
  }, []);

  // Add function to save preferences
  const savePreferences = () => {
    localStorage.setItem("autoSaveDrafts", autoSaveDrafts.toString());
    localStorage.setItem("defaultFlag", defaultFlag);
    setFeedbackMessage("Preferences saved successfully!");
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }
  
    try {
      const res = await fetch(`http://127.0.0.1:8000/users/${user.id}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setErrorMessage(data.detail || "Failed to update password.");
      } else {
        setFeedbackMessage(data.message);
        setErrorMessage(null);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setErrorMessage("Server error. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/users/${user.id}/delete-account`, {
        method: "DELETE",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setErrorMessage(data.detail || "Failed to delete account.");
      } else {
        setFeedbackMessage(data.message);
        router.push("/signin");
        // Optional: redirect or logout user here
      }
    } catch (err) {
      setErrorMessage("Server error. Please try again.");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Account & Privacy":
        return (
          <div className="space-y-6">
            {/* Change Password Section */}
            <form className="space-y-3" onSubmit={handlePasswordUpdate}>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-dcpurple"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-dcpurple"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-dcpurple"
                />
              </div>
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
              {feedbackMessage && <p className="text-green-400 text-sm">{feedbackMessage}</p>}
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-dcpurple text-white rounded-md hover:bg-purple-700 transition"
              >
                Update Password
              </button>
            </form>
        
            {/* Delete Account Section */}
            <div className="bg-zinc-800 p-4 rounded-xl shadow mt-8">
              <h3 className="text-lg font-semibold mb-2 text-red-400">Delete Account</h3>
              <p className="text-zinc-400 mb-3">
                Deleting your account is permanent and cannot be undone. All your data will be lost.
              </p>
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
              {feedbackMessage && <p className="text-green-400 text-sm">{feedbackMessage}</p>}
              <button
                onClick={() => setConfirmOpen(true)}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete My Account
              </button>
            </div>
          </div>

        );
      case "Preferences":
        return (
          <div className="space-y-6">
            <div className="bg-zinc-800 p-4 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4 text-white">Notification Preferences</h3>
              
              {/* Default Flag Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Default Notification Flag
                </label>
                <select
                  value={defaultFlag}
                  onChange={(e) => setDefaultFlag(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-dcpurple"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="info">Info</option>
                </select>
                <p className="text-sm text-zinc-400 mt-1">
                  This flag will be pre-selected when creating new notifications
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={savePreferences}
                className="mt-4 px-4 py-2 bg-dcpurple text-white rounded-md hover:bg-purple-700 transition"
              >
                Save Preferences
              </button>

              {feedbackMessage && (
                <p className="mt-2 text-green-400 text-sm">{feedbackMessage}</p>
              )}
            </div>
          </div>
        );
      case "Accessibility":
        return <p className="text-zinc-300 italic">Accessibility settings coming soon.</p>;
      default:
        return null;
    }
  };

  return (
    
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl h-[500px] rounded-2xl bg-zinc-900 p-6 shadow-xl flex">
          {/* Sidebar Tabs */}
          <div className="w-1/4 border-r border-zinc-700 pr-4 flex flex-col space-y-2">
            <h2 className="text-lg font-semibold text-white mb-2">Settings</h2>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-dcpurple text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="w-3/4 pl-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold">
                {activeTab}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-full bg-dcpurple text-white font-semibold hover:bg-purple-700 transition"
                >
                Close
                </button>
            </div>
            <div className="overflow-y-auto pr-2 h-[400px]">
              {renderTabContent()}
            </div>
          </div>
        </Dialog.Panel>
      </div>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-md w-full bg-zinc-900 rounded-xl p-6 text-white shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-2">Confirm Deletion</Dialog.Title>
            <p className="text-sm text-zinc-300 mb-4">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded bg-zinc-700 text-white hover:bg-zinc-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  handleDeleteAccount();
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Dialog>
  );
};