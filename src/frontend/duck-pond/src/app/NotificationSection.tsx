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
  const [selectedItems, setSelectedItems] = React.useState<{
    [key: string]: string[];
  }>({
    App: [],
    "Dept.": [],
    Time: [],
    Flags: [],
    Read: [],
  });

  const [notifications, setNotifications] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/notifications");
        const data = await res.json();
        console.log("Fetched notifications:", data);
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleDropdownToggle = (button: string) => {
    setOpenDropdown(openDropdown === button ? null : button);
  };

  const handleSelectItem = (button: string, item: string) => {
    setSelectedItems((prevSelected) => ({
      ...prevSelected,
      [button]: prevSelected[button].includes(item)
        ? prevSelected[button].filter((i) => i !== item)
        : [...prevSelected[button], item],
    }));
  };

  const dropdownItems = {
    App: ["Duck Creek", "Gmail", "Slack", "SMS", "Twitter"],
    "Dept.": ["Policy", "Claims", "Payment", "General", "News"],
    Time: ["Last Hour", "Last Day", "Last Week"],
    Flags: ["Important", "Urgent", "Normal"],
    Read: ["Read", "Unread"],
  };

  const mapToDisplayFormat = (notification: any) => {
    if (notification.title && notification.details) {
      return {
        title: notification.title,
        appName: "Duck Creek",
        dept: "News",
        time: "Last Day",
        flag: "Important",
        read: notification.is_Read ? "Read" : "Unread",
      };
    } else if (notification.subject && notification.body) {
      return {
        title: notification.subject,
        appName: "Duck Creek",
        dept: "Policy",
        time: "Last Day",
        flag: "Urgent",
        read: notification.is_Read ? "Read" : "Unread",
      };
    } else if (notification.claimant_Name) {
      return {
        title: `${notification.claimant_Name} - ${notification.task_Type}`,
        appName: "Duck Creek",
        dept: "Claims",
        time: "Last Week",
        flag: "Important",
        read: "Unread",
      };
    }

    return null;
  };

  const filteredNotifications = notifications
  .map(mapToDisplayFormat)
  .filter((notification) => {
    if (!notification) return false;

    return (
      (selectedItems["App"].length === 0 || selectedItems["App"].includes(notification.appName)) &&
      (selectedItems["Dept."].length === 0 || selectedItems["Dept."].includes(notification.dept)) &&
      (selectedItems["Time"].length === 0 || selectedItems["Time"].includes(notification.time)) &&
      (selectedItems["Flags"].length === 0 || selectedItems["Flags"].includes(notification.flag)) &&
      (selectedItems["Read"].length === 0 || selectedItems["Read"].includes(notification.read))
    );
  });


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
        {filteredNotifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications found.</p>
        ) : (
          filteredNotifications.map((notification, index) => (
            <NotificationCard
              key={index}
              title={notification.title}
              appName={notification.appName}
              imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/e3ce0b7da5c7811b070dc634107c391ec4075045"
            />
          ))
        )}
      </div>
    </section>
  );
};