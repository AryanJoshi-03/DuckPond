"use client";
import * as React from "react";

export const NavigationMenu: React.FC = () => {
  return (
    <nav className="flex flex-col gap-10 items-center px-0 py-5 w-24 bg-gray-100 rounded-[96px]">
      <div className="flex flex-col gap-1 items-center">
        <button
          className="flex justify-center items-center w-12 h-12"
          aria-label="Menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 18V16L21 16V18H3ZM3 13L3 11L21 11V13L3 13ZM3 8L3 6L21 6V8L3 8Z"
              fill="#49454F"
            />
          </svg>
        </button>
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center px-4 py-1 bg-purple-200 rounded-[100px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 14V9.85L9.4 11.45L8 10L12 6L16 10L14.6 11.45L13 9.85V14H11ZM5 21C4.45 21 3.975 20.8083 3.575 20.425C3.19167 20.025 3 19.55 3 19V5C3 4.45 3.19167 3.98333 3.575 3.6C3.975 3.2 4.45 3 5 3H19C19.55 3 20.0167 3.2 20.4 3.6C20.8 3.98333 21 4.45 21 5V19C21 19.55 20.8 20.025 20.4 20.425C20.0167 20.8083 19.55 21 19 21H5Z"
                fill="#4A4459"
              />
            </svg>
          </div>
          <span className="text-xs font-semibold text-zinc-900">Sent</span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <button
            className="flex items-center px-0 py-1"
            aria-label="Direct Messages"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="20" fill="#EADDFF" />
              <text
                fill="#4F378A"
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
                fontFamily="Roboto"
                fontSize="16"
                fontWeight="500"
                letterSpacing="0.1px"
              >
                <tspan x="14.6453" y="25.4688">
                  A
                </tspan>
              </text>
            </svg>
          </button>
          <span className="text-xs text-zinc-700">DM</span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <button className="flex items-center px-0 py-1" aria-label="Spaces">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 20V17.225C0 16.6583 0.141667 16.1333 0.425 15.65C0.708333 15.1667 1.1 14.8 1.6 14.55C1.83333 14.4333 2.05833 14.325 2.275 14.225C2.50833 14.125 2.75 14.0333 3 13.95V20H0Z"
                fill="#49454F"
              />
            </svg>
          </button>
          <span className="text-xs text-zinc-700">Spaces</span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <button
            className="flex items-center px-0 py-1"
            aria-label="Conference"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 20C3.45 20 2.975 19.8083 2.575 19.425C2.19167 19.025 2 18.55 2 18V6C2 5.45 2.19167 4.98333 2.575 4.6C2.975 4.2 3.45 4 4 4H16C16.55 4 17.0167 4.2 17.4 4.6C17.8 4.98333 18 5.45 18 6V10.5L22 6.5V17.5L18 13.5V18C18 18.55 17.8 19.025 17.4 19.425C17.0167 19.8083 16.55 20 16 20H4Z"
                fill="#49454F"
              />
            </svg>
          </button>
          <span className="text-xs text-zinc-700">Conference</span>
        </div>
      </div>
    </nav>
  );
};