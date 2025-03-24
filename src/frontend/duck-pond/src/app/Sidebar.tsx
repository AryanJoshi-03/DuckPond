"use client";
import * as React from "react";
import { NavigationMenu } from "./NavigationMenu";
import Image from "next/image";

export const Sidebar: React.FC = () => {
  return (
    <aside className="flex flex-col gap-4 max-md:w-full justify-center items-center">
        <Image
        src="/DP_Logo_White.png" // Path relative to the public directory
        alt="Duck Pond Logo"
        width={100} // Set appropriate width
        height={100} // Set appropriate height
      />
      <button className="flex gap-3 items-center p-4 h-14 bg-dcpurple rounded-2xl shadow-md cursor-pointer w-[138px]">
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 19H6.925L16.7 9.225L15.275 7.8L5.5 17.575V19ZM3.5 21V16.75L16.7 3.575C16.9 3.39167 17.1208 3.25 17.3625 3.15C17.6042 3.05 17.8583 3 18.125 3C18.3917 3 18.65 3.05 18.9 3.15C19.15 3.25 19.3667 3.4 19.55 3.6L20.925 5C21.125 5.18333 21.2708 5.4 21.3625 5.65C21.4542 5.9 21.5 6.15 21.5 6.4C21.5 6.66667 21.4542 6.92083 21.3625 7.1625C21.2708 7.40417 21.125 7.625 20.925 7.825L7.75 21H3.5Z"
            fill="white"
          />
        </svg>
        <span className="text-sm font-medium text-white">Compose</span>
      </button>
      <button className="h-10 text-sm font-medium text-white cursor-pointer bg-slate-500 rounded-[100px] w-[137px]">
        Configure Apps
      </button>
      <NavigationMenu />
    </aside>
  );
};
