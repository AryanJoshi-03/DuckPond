"use client";
import * as React from "react";
import Image from "next/image";
import { Inbox, Send, FileText } from "lucide-react"; // professional icons
import ComposeButton from "./ComposeButton";
import ComposeModal from "./ComposeModal";

interface SidebarProps {
  currentView: "inbox" | "sent";
  setView: (view: "inbox" | "sent") => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const [showModal, setShowModal] = React.useState(false);

  const menuItems = [
    { label: "Inbox", icon: <Inbox size={18} /> },
    { label: "Sent", icon: <Send size={18} /> },
    { label: "Drafts", icon: <FileText size={18} /> },
  ];

  return (
    <>
      <aside className="flex flex-col gap-4 max-md:w-full justify-center items-center">
        <Image
          src="/DP_Logo_White.png"
          alt="Duck Pond Logo"
          width={100}
          height={100}
        />
        <ComposeButton onClick={() => setShowModal(true)} />
        <button className="h-10 text-sm font-medium text-white cursor-pointer bg-slate-500 rounded-[100px] w-[137px]">
          Configure Apps
        </button>

        {/* Refined menu */}
        <div className="flex flex-col w-full items-start mt-2 px-2 gap-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setView(item.label.toLowerCase() as "inbox" | "sent")}
              className={`flex items-center w-full gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  currentView === item.label.toLowerCase()
                    ? "bg-dcpurple text-white"
                    : "text-white hover:bg-dcpurple/20"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {showModal && <ComposeModal onClose={() => setShowModal(false)} />}
    </>
  );
};

