"use client";
import * as React from "react";
import { NotificationCard } from "./NotificationCard";
import NotifContent from "./NotifContent";

const Dropdown: React.FC<{
    items: string[];
    selectedItems: string[];
    onSelect: (item: string) => void;
}> = ({ items, selectedItems, onSelect }) => {
    return (
        <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
                {items.map((item) => (
                    <label
                        key={item}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item)}
                            onChange={() => onSelect(item)}
                            className="mr-2"
                        />
                        {item}
                    </label>
                ))}
            </div>
        </div>
    );
};

export const NotificationSection: React.FC = () => {
    const filterButtons: Array<keyof typeof dropdownItems> = ["App", "Dept.", "Time", "Flags", "Read"];
    const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
    const [selectedItems, setSelectedItems] = React.useState<{ [key: string]: string[] }>({
        "App": [],
        "Dept.": [],
        "Time": [],
        "Flags": [],
        "Read": [],
    });

    const notifications = [
        { title: "Policy Renewal Reminder", appName: "Slack", dept: "Policy", time: "Last Hour", flag: "Important", read: "Unread", message: "Your policy renewal is due in 5 days. Please review and update your information." },
        { title: "Claims Status Update", appName: "Duck Creek", dept: "Claims", time: "Last Day", flag: "Important", read: "Read", message: "Your claim #12345 has been processed and approved. You can view the details in your dashboard." },
        { title: "Payment Due Reminder", appName: "Duck Creek", dept: "Payment", time: "Last Week", flag: "Urgent", read: "Unread", message: "Your payment of $500 is due tomorrow. Please ensure sufficient funds are available." },
        { title: "Team meeting at LGRC @2", appName: "Gmail", dept: "General", time: "Last Hour", flag: "General", read: "Read", message: "Reminder: Team meeting in LGRC room 101 at 2 PM today. Please bring your project updates." },
        { title: "Professor Anderson posted a note on Piazza", appName: "Gmail", dept: "General", time: "Last Day", flag: "Urgent", read: "Unread", message: "Professor Anderson has posted important updates about the upcoming exam. Please review the course materials." },
    ];

    const handleDropdownToggle = (button: string) => {
        setOpenDropdown(openDropdown === button ? null : button);
    };

    const handleSelectItem = (button: string, item: string) => {
        setSelectedItems((prevSelected) => ({
            ...prevSelected,
            [button]: prevSelected[button].includes(item)
                ? prevSelected[button].filter((i) => i !== item) // Deselect if already selected
                : [...prevSelected[button], item], // Select if not already selected
        }));
    };

    const dropdownItems: { [key in "App" | "Dept." | "Time" | "Flags" | "Read"]: string[] } = {
        "App": ["Duck Creek", "Gmail", "Slack", "SMS", "Twitter"],
        "Dept.": ["Policy", "Claims", "Payment","General"],
        "Time": ["Last Hour", "Last Day", "Last Week"],
        "Flags": ["Important", "Urgent", "Normal"],
        "Read": ["Read", "Unread"],
    };

    const filterNotifications = () => {
        return notifications.filter((notification) => {
            return (
                (selectedItems["App"].length === 0 || selectedItems["App"].includes(notification.appName)) &&
                (selectedItems["Dept."].length === 0 || selectedItems["Dept."].includes(notification.dept)) &&
                (selectedItems["Time"].length === 0 || selectedItems["Time"].includes(notification.time)) &&
                (selectedItems["Flags"].length === 0 || selectedItems["Flags"].includes(notification.flag)) &&
                (selectedItems["Read"].length === 0 || selectedItems["Read"].includes(notification.read))
            );
        });
    };

    const [activeNotification, setActiveNotification] = React.useState<{
        title: string;
        appName: string;
        dept: string;
        time: string;
        flag: string;
        read: string;
        message: string;
    } | null>(null);

    function setOpenNotification(notification: { title: string; appName: string; dept: string; time: string; flag: string; read: string; message: string; }): void {
        setActiveNotification(notification);
    }

    const handleBack = () => {
        setActiveNotification(null);
    };

    if (activeNotification) {
        return (
            <section className="flex-1">
                <NotifContent 
                    subject={activeNotification.title}
                    sender={activeNotification.appName}
                    timeSent={activeNotification.time}
                    message={activeNotification.message}
                    onBack={handleBack}
                />
            </section>
        );
    }

    return (
        <section className="flex-1">
            <div className="flex flex-wrap gap-4 mb-6 justify-center pt-4 relative">
                {filterButtons.map((button) => (
                    <div key={button} className="relative">
                        <button
                            onClick={() => handleDropdownToggle(button)}
                            className="px-6 h-10 text-sm font-medium text-white bg-dcpurple rounded-[100px]"
                        >
                            {button}
                        </button>
                        {openDropdown === button && (
                            <Dropdown
                                items={dropdownItems[button]}
                                selectedItems={selectedItems[button]}
                                onSelect={(item) => handleSelectItem(button, item)}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-4">
                {filterNotifications().map((notification, index) => (
                    <div
                        key={index}
                        onClick={() => setOpenNotification(notification)}
                        className="cursor-pointer"
                    >
                        <NotificationCard
                            title={notification.title}
                            appName={notification.appName}
                            imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/e3ce0b7da5c7811b070dc634107c391ec4075045"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};