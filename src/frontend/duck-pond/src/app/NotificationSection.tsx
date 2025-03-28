"use client";
import * as React from "react";
import { NotificationCard } from "./NotificationCard";

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
    const filterButtons = ["App", "Dept.", "Time", "Flags", "Read"];
    const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
    const [selectedItems, setSelectedItems] = React.useState<{ [key: string]: string[] }>({
        "App": [],
        "Dept.": [],
        "Time": [],
        "Flags": [],
        "Read": [],
    });

    const notifications = [
        { title: "Policy Renewal Reminder", appName: "Slack", dept: "Policy", time: "Last Hour", flag: "Important", read: "Unread" },
        { title: "Claims Status Update", appName: "Duck Creek", dept: "Claims", time: "Last Day", flag: "Important", read: "Read" },
        { title: "Payment Due Reminder", appName: "Duck Creek", dept: "Payment", time: "Last Week", flag: "Urgent", read: "Unread" },
        { title: "Team meeting at LGRC @2", appName: "Gmail", dept: "General", time: "Last Hour", flag: "General", read: "Read" },
        { title: "Professor Anderson posted a note on Piazza", appName: "Gmail", dept: "General", time: "Last Day", flag: "Urgent", read: "Unread" },
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

    const dropdownItems = {
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