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
    <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
      <div className="py-1">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
  const filterButtons = ["App", "Dept.", "Time", "Flags", "Read"] as const;
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
  const [selectedNotification, setSelectedNotification] = React.useState<any | null>(null);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/notifications/user/1");
        const data = await res.json();
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
    const formatDate = (isoDate: string) => {
      const date = new Date(isoDate);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    let common = {
      appName: notification.Apptype,
      time: "Last Day",
      flag: "Important",
      read: notification.is_Read ? "Read" : "Unread",
    };
    return {
      ...notification,
      ...common
    }
    if (notification.subject && notification.details) {
      return {
        sender: notification.Sender_id,
        subject: notification.subject,
        preview: notification.details,
        date: formatDate(notification.date_Created),
        department: "News",
        dept: "News",
        isRead: notification.is_Read,
        ...common,
        original: notification,
      };
    } else if (notification.subject && notification.body) {
      return {
        sender: "DuckPond Bot",
        subject: notification.subject,
        preview: notification.body,
        date: formatDate(notification.date_Created),
        department: "Policy",
        dept: "Policy",
        isRead: notification.is_Read,
        ...common,
        original: notification,
      };
    } else if (notification.claimant_Name) {
      return {
        sender: notification.insured_Name || "Unknown Sender",
        subject: notification.task_Type,
        preview: notification.description,
        date: formatDate(notification.date_Created),
        department: "Claims",
        dept: "Claims",
        isRead: notification.is_Read,
        ...common,
        original: notification,
      };
    }

    return null;
  };

  const filteredNotifications = notifications
    .map(mapToDisplayFormat)
    .filter((notification): notification is NonNullable<typeof notification> => {
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
    <section className="flex-1 h-full">
      {selectedNotification ? (
        <NotifContent
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      ) : (
        <>
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
                    items={dropdownItems[button as keyof typeof dropdownItems]}
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
                  appName={notification.App_type}
                  sender={notification.Sender_id}
                  subject={notification.subject}
                  preview={notification.preview}
                  date={new Date(notification.date_Created).toLocaleDateString()}
                  department={notification.notification_type}
                  isRead={notification.isRead}
                  onClick={() => setSelectedNotification(notification)}
                />
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
};