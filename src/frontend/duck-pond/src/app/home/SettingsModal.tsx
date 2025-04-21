"use client";
import * as React from "react";
import { Dialog } from "@headlessui/react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  "Notifications",
  "Appearance",
  "Account & Privacy",
  "Preferences",
  "Accessibility",
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Notifications":
        return <p className="text-zinc-300">Notification settings go here.</p>;
      case "Appearance":
        return <p className="text-zinc-300">Appearance settings go here.</p>;
      case "Account & Privacy":
        return <p className="text-zinc-300">Account and privacy options go here.</p>;
      case "Preferences":
        return <p className="text-zinc-300">User preferences go here.</p>;
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
    </Dialog>
  );
};