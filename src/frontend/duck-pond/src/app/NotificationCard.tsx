"use client";
import * as React from "react";
import Image from "next/image";

interface NotificationCardProps {
  title: string;
  appName: string;
  imageUrl: string;
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
  title,
  appName,
  imageUrl,
}) => {
  return (
    <article className="flex w-full h-20 bg-fuchsia-50 rounded-xl border border-stone-300">
      <div className="flex flex-1 gap-4 items-center p-4">
        <div className="flex items-center">
          {getAppLogo(appName)}
        </div>
        <div className="flex-1">
          <h3 className="text-base text-zinc-900">{title}</h3>
          <p className="text-sm text-zinc-900">{appName}</p>
        </div>
      </div>
      <div className="flex justify-center items-center w-20 border border-stone-300">
        <img src={imageUrl} alt="" className="w-[80px] h-[80px] object-contain" />
      </div>
    </article>
  );
};
