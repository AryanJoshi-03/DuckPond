"use client";
import * as React from "react";

interface NotificationCardProps {
  sender: string;
  subject: string;
  preview: string;
  date: string;
  department: string;
  isRead: boolean;
  onClick?: () => void; // ✅ Optional click handler
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  sender,
  subject,
  preview,
  date,
  department,
  isRead,
  onClick,
}) => {
  return (
    <div
      onClick={onClick} //  Makes the whole card clickable
      className="flex items-center justify-between bg-fuchsia-50 px-4 py-3 rounded-xl border border-stone-300 cursor-pointer hover:bg-fuchsia-100 transition-all"
    >
      {/* Left side: text info */}
      <div className="flex flex-col">
        <span className="text-sm text-zinc-600">
          {sender} • {department}
        </span>
        <span className={`text-base ${isRead ? "font-normal" : "font-bold"} text-zinc-900`}>
          {subject}
        </span>
        <span className="text-sm text-zinc-500 truncate max-w-[300px]">
          {preview}
        </span>
      </div>

      {/* Right side: timestamp and logo */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-500 whitespace-nowrap">{date}</span>
        <img
          src="/DP_Logo_White.png"
          alt="DuckPond Logo"
          className="w-10 h-10"
        />
      </div>
    </div>
  );
};