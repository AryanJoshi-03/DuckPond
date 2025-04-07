"use client"; // At the top of the file

import React from "react";

interface ComposeButtonProps {
  onClick: () => void;
}

const ComposeButton: React.FC<ComposeButtonProps> = ({ onClick }) => {
  return (
    <button
      className="flex gap-3 items-center pl-4 h-14 bg-dcpurple rounded-2xl shadow-md cursor-pointer w-[160px]"
      onClick={onClick}
    >
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.5 19H6.925L16.7 9.225L15.275 7.8L5.5 17.575V19ZM3.5 21V16.75L16.7 3.575C16.9 3.39167 17.1208 3.25 17.3625 3.15C17.6042 3.05 17.8583 3 18.125 3C18.3917 3 18.65 3.05 18.9 3.15C19.15 3.25 19.3667 3.4 19.55 3.6L20.925 5C21.125 5.18333 21.2708 5.4 21.3625 5.65C21.4542 5.9 21.5 6.15 21.5 6.4C21.5 6.66667 21.4542 6.92083 21.3625 7.1625C21.2708 7.40417 21.125 7.625 20.925 7.825L7.75 21H3.5Z"
          fill="white"
        />
      </svg>
      <span className="text-sm font-medium text-white">Compose</span>
    </button>
  );
};

export default ComposeButton;