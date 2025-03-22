"use client";
import * as React from "react";
import { NotificationCard } from "./NotificationCard";

export const NotificationSection: React.FC = () => {
    const filterButtons = ["App", "Dept.", "Time", "Flags", "Read"];
    const notifications = [
        { title: "Notification 1", appName: "App 1" },
        { title: "Notification 2", appName: "App 4" },
        { title: "Notification 3", appName: "App 3" },
        { title: "Notification 4", appName: "App 2" },
        { title: "Notification 5", appName: "App 5" },
    ];

    return (
        <section className="flex-1">
            <div className="flex flex-wrap gap-4 mb-6 justify-center pt-4">
                {filterButtons.map((button) => (
                    <button
                        key={button}
                        className="px-6 h-10 text-sm font-medium text-white bg-dcpurple rounded-[100px]"
                    >
                        {button}
                    </button>
                ))}
            </div>
            <div className="flex flex-col gap-4">
                {notifications.map((notification, index) => (
                    <NotificationCard
                        key={index}
                        title={notification.title}
                        appName={notification.appName}
                        imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/e3ce0b7da5c7811b070dc634107c391ec4075045"
                    />
                ))}
            </div>
        </section>
    );
};
