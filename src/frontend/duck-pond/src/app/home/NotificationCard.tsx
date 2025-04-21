"use client";
import * as React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface NotificationCardProps {
  appName: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  department: string;
  isRead: boolean;
  onClick?: () => void; // ✅ Optional click handler
  isSent?: boolean; // Add this prop to indicate if it's a sent notification
  recipients?: string[]; // Add this prop for the list of recipients
}

const getAppLogo = (appName: string) => {
    switch (appName.toLowerCase()) {
        case 'slack':
            return (
                <div className="w-10 h-10 flex items-center justify-center">
                    <Image
                        src="/slack_icon.svg"
                        alt="Slack Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                </div>
            );
        case 'gmail':
            return (
                <div className="w-10 h-10 flex items-center justify-center">
                    <Image
                        src="/Gmail_icon.svg"
                        alt="Gmail Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                </div>
            );
        case 'duck creek':
        case 'duckpond':
            return (
          <div className="w-10 h-10 flex items-center justify-center">
              <Image
            src="/DuckCreek.svg"
            alt="Duck Creek Logo"
            width={40}
            height={40}
            className="object-contain"
              />
          </div>
            );
        default:
            return (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_38_792)">
                        <circle cx="20" cy="20" r="20" fill="#EADDFF"/>
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
                                {appName.charAt(0)}
                            </tspan>
                        </text>
                    </g>
                    <defs>
                        <clipPath id="clip0_38_792">
                            <rect width="40" height="40" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            );
    }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  appName,
  sender,
  subject,
  preview,
  date,
  department,
  isRead,
  onClick,
  isSent = false, // Default to false
  recipients = [], // Default to empty array
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // After mounting, we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Format recipients for display
  const formatRecipients = () => {
    console.log("Recipients:", recipients);
    if (!recipients || recipients.length === 0) {
      return "No recipients";
    }
    
    if (recipients.length === 1) {
      return `To: ${recipients[0]}`;
    }
    
    return `To: ${recipients[0]} +${recipients.length - 1} more`;
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-fuchsia-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-stone-300 dark:border-gray-700 cursor-pointer hover:bg-fuchsia-100 dark:hover:bg-gray-700 transition-all"
    >
      <div className="flex items-center flex-1">
        <div className="flex items-center px-2">
          {getAppLogo(appName)}
        </div>
        {/* Left side: text info */}
        <div className="flex flex-col px-2 flex-1">
          <span className="text-sm text-zinc-600 dark:text-zinc-300">
            {isSent ? formatRecipients() : `${sender} • ${department}`}
          </span>
          <span className={`text-base ${isRead ? "font-normal" : "font-bold"} text-zinc-900 dark:text-zinc-100`}>
            {subject}
          </span>
          {!isSent && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate max-w-[300px]">
              {preview}
            </span>
          )}
        </div>
      </div>

      {/* Right side: timestamp and logo */}
      <div className="flex items-center gap-4 ml-4">
        <span className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{date}</span>
        <img
          src={mounted && theme === "light" ? "/DP_Logo_Black.png" : "/DP_Logo_White.png"}
          alt="DuckPond Logo"
          className="w-10 h-10"
        />
      </div>
    </div>
  );
};