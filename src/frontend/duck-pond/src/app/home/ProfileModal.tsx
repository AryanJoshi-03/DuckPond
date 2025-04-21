"use client";
import * as React from "react";
import { Dialog } from "@headlessui/react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-gray-900 text-white p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="border-b border-gray-700 pb-4 mb-4">
            <Dialog.Title className="text-2xl font-semibold text-white">
              Profile Information
            </Dialog.Title>
            <p className="text-sm text-gray-400 mt-1">
              View your personal details.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="text-gray-400">First Name</label>
              <div className="font-medium text-white">{user?.first_Name || "N/A"}</div>
            </div>
            <div>
              <label className="text-gray-400">Last Name</label>
              <div className="font-medium text-white">{user?.last_Name || "N/A"}</div>
            </div>
            <div>
              <label className="text-gray-400">Email</label>
              <div className="font-medium text-white">{user?.email || "N/A"}</div>
            </div>
            <div>
              <label className="text-gray-400">Username</label>
              <div className="font-medium text-white">{user?.username || "N/A"}</div>
            </div>
            <div>
              <label className="text-gray-400">Role</label>
              <div className="font-medium text-white">{user?.user_Type || "N/A"}</div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-dcpurple text-white font-semibold hover:bg-purple-700 transition"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
