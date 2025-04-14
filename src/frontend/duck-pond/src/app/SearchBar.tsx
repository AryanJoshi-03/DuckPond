"use client";
import * as React from "react";

export const SearchBar: React.FC = () => {
    return (
        <div className="flex-1 px-6 pb-3">
            <div className="flex gap-1 items-center mx-auto w-full h-14 bg-gray-200 dark:bg-gray-800 rounded-3xl max-w-2/3">
                <div className="flex flex-1 gap-1 items-center p-1">
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
                                d="M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Search Text"
                        className="flex-1 text-base text-zinc-700 dark:text-zinc-300 bg-transparent border-none outline-none"
                    />
                    <button
                        className="flex justify-center items-center w-12 h-12"
                        aria-label="Search"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
                                fill="#49454F"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
