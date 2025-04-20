"use client";
import * as React from "react";
import { NotificationCard } from "./NotificationCard";
import NotifContent from "./NotifContent";

import { SearchBar } from "@/app/SearchBar";

const Dropdown: React.FC<{
  items: string[];
  selectedItems: string[];
  onSelect: (item: string) => void;
}> = ({ items, selectedItems, onSelect }) => {
  return (
    <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
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

interface NotificationSectionProps {
  view: "inbox" | "sent" | "drafts";
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({ view }) => {
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const dropdownRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

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
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Add click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        const dropdownElement = dropdownRefs.current[openDropdown];
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);
  
  React.useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/notifications/user/67fd9ef604e2c1cce7e1ec9b");
        if (!res.ok) {
          console.error("Error fetching notifications:", res.status);
          setNotifications([]);
          setError(`Failed to fetch notifications: ${res.status}`);
          return;
        }
        const data = await res.json();
        console.log("Fetched inbox notifications:", data);
        setNotifications(data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
        setError("Failed to fetch notifications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/notifications/sent/user/0");
        if (!res.ok) {
          console.error("Error fetching sent notifications:", res.status);
          setNotifications([]);
          setError(`Failed to fetch sent notifications: ${res.status}`);
          return;
        }
        const data = await res.json();
        console.log("Fetched sent notifications:", data);
        setNotifications(data || []);
      } catch (err) {
        console.error("Error fetching sent notifications:", err);
        setNotifications([]);
        setError("Failed to fetch sent notifications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch notifications when in inbox view
    if (view === "inbox") {
    fetchNotifications();
    } else if (view === "sent") {
      fetchSent();
    } else if (view === "drafts") {
      // For drafts, we'll set an empty array for now
      setNotifications([]);
    }
  }, [view]);

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
    if (!notification) return null;
    
    const formatDate = (isoDate: string) => {
      if (!isoDate) return "No date";
      const date = new Date(isoDate);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    let common = {
      appName: (notification.App_type || "DuckPond").toLowerCase(),
      time: "Last Day",
      flag: "Important",
      read: notification.is_Read ? "Read" : "Unread",
    };

    // Create a basic notification object with default values
    let formattedNotification = {
      ...notification,
        ...common,
      sender: notification.Sender_id || "System",
      subject: notification.subject || "No Subject",
      preview: "",
        date: formatDate(notification.date_Created),
      department: (notification.notification_type || "General").toLowerCase(),
      dept: (notification.notification_type || "General").toLowerCase(),
      isRead: notification.is_Read || false,
      recipients: notification.sent_to || [],
      };
    
    // Add preview based on notification type
    if (notification.notification_type === "policy" && notification.details && notification.details.body) {
      formattedNotification.preview = notification.details.body;
    } else if (notification.notification_type === "news" && notification.details && notification.details.details) {
      formattedNotification.preview = notification.details.details;
    } else if (notification.notification_type === "claims" && notification.details && notification.details.description) {
      formattedNotification.preview = notification.details.description;
    } else {
      formattedNotification.preview = "No preview available";
    }
    
    // For sent notifications, add information about recipients
    if (notification.sent_to && Array.isArray(notification.sent_to)) {
      formattedNotification.preview = `Sent to ${notification.sent_to.length} recipient(s)`;
    }

    return formattedNotification;
  };

  let filteredNotifications = notifications
    .map(mapToDisplayFormat)
    .filter((notification): notification is NonNullable<typeof notification> => {
      if (!notification) return false;
      return (
        (selectedItems["App"].length === 0 || selectedItems["App"].some(item => item.toLowerCase() === notification.appName)) &&
        (selectedItems["Dept."].length === 0 || selectedItems["Dept."].some(item => item.toLowerCase() === notification.dept)) &&
        (selectedItems["Time"].length === 0 || selectedItems["Time"].some(item => item.toLowerCase() === notification.time.toLowerCase())) &&
        (selectedItems["Flags"].length === 0 || selectedItems["Flags"].some(item => item.toLowerCase() === notification.flag.toLowerCase())) &&
        (selectedItems["Read"].length === 0 || selectedItems["Read"].some(item => item.toLowerCase() === notification.read.toLowerCase()))
      );
    });

    // Combine with search results
    filteredNotifications = searchResults.length > 0
    ? filteredNotifications.filter(notification => 
        searchResults.some(result => result.id === notification.id)
      )
    : filteredNotifications;

  console.log("Current view:", view);
  console.log("Filtered notifications:", filteredNotifications);

  return (
    <section className="flex-1 h-full">
      {selectedNotification ? (
        <NotifContent
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      ) : (
        <>
          {view === "inbox" ? (
        <>
          <div className="flex flex-wrap gap-4 mb-6 justify-center pt-4 relative">
            {filterButtons.map((button) => (
                  <div 
                    key={button} 
                    className="relative"
                    ref={(el) => {
                      if (el) {
                        dropdownRefs.current[button] = el;
                      }
                    }}
                  >
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
                {isLoading ? (
                  <p className="text-center text-gray-500">Loading notifications...</p>
                ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : filteredNotifications.length === 0 ? (
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
                      isSent={false}
                      recipients={[]}
                />
              ))
            )}
          </div>
            </>
          ) : view === "sent" ? (
            <div className="flex flex-col items-center w-full pt-8">
              <div className="w-full max-w-4xl px-4">
                <h2 className="text-2xl font-semibold mb-6 text-center">Sent Notifications</h2>
                {isLoading ? (
                  <p className="text-center text-gray-500">Loading sent notifications...</p>
                ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : filteredNotifications.length === 0 ? (
                  <p className="text-center text-gray-500">No sent notifications found.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {filteredNotifications.map((notification, index) => (
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
                        isSent={true}
                        recipients={notification.sent_to || []}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-semibold mb-4">Drafts</h2>
              <p className="text-gray-500">Your draft notifications will appear here.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
};