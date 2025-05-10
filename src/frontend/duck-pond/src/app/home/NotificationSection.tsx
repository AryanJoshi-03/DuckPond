"use client";
import * as React from "react";
import { NotificationCard } from "./NotificationCard";
import NotifContent from "./NotifContent";
import ComposeModal from "./ComposeModal";

import { SearchBar } from "@/app/home/SearchBar";
import { useAuth } from "@/hooks/useAuth";

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

interface Notification {
  notification_id: number;
  Sender_id: string;
  Sender_email: string;
  App_type: string;
  is_Read: boolean;
  is_Archived: boolean;
  is_Drafted: boolean;
  date_Created: string;
  subject: string;
  notification_type: string;
  flag: string;
  details: {
    body?: string;
    details?: string;
    description?: string;
    policy_id?: number;
    expiration_Date?: string;
    type?: string;
    insured_Name?: string;
    claimant_Name?: string;
    task_Type?: string;
    due_Date?: string;
    line_Business?: string;
  };
  sent_to?: string[];
}

interface NotificationSectionProps {
  view: "inbox" | "sent" | "drafts";
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({ view }) => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = React.useState<Notification[]>([]);
  const [query, setQuery] = React.useState("");
  const [showComposeModal, setShowComposeModal] = React.useState(false);
  const [selectedDraft, setSelectedDraft] = React.useState<Notification | null>(null);
  const dropdownRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filterButtons = ["Dept.", "Time", "Flags", "Read"] as const;
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
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
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
        const res = await fetch(`http://127.0.0.1:8000/notifications/user/${user?.id}`);
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
        const res = await fetch(`http://127.0.0.1:8000/notifications/sent/user/${user?.id}`);
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
  
    if (view === "inbox") {
      fetchNotifications();
    } else if (view === "sent") {
      fetchSent();
    } else if (view === "drafts") {
      fetchNotifications(); // Still fetch inbox notifications (drafts are mixed in with is_Drafted = true)
    }
  }, [view, user?.id]);

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

  const dropdownItems: Record<string, string[]> = {
    "Dept.": ["Policy", "Claims", "News"],
    Time: ["Last Hour", "Last Day", "Last Week"],
    Flags: ["Important", "Normal", "Info"],
    Read: ["Read", "Unread"],
  };

  const mapToDisplayFormat = (notification: Notification) => {
    if (!notification) return null;
  
    const formatDate = (isoDate: string) => {
      if (!isoDate) return "No date";
      const date = new Date(isoDate);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
  
    const calculateTimeCategory = (isoDate: string) => {
      if (!isoDate) return "Unknown";
      const notificationDate = new Date(isoDate);
      const now = new Date();
      const diffInMs = now.getTime() - notificationDate.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);
  
      if (diffInHours <= 1 ) return "Last Hour";
      if (diffInHours <= 24) return "Last Day";
      if (diffInHours <= 168) return "Last Week"; // 7 days * 24 hours
      return "Older";
    };
  
    const common = {
      appName: (notification.App_type || "DuckPond").toLowerCase(),
      time: calculateTimeCategory(notification.date_Created),
      flag: notification.flag || "normal",
      read: notification.is_Read ? "Read" : "Unread",
    };
  
    const formattedNotification = {
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

  const filteredNotifications = notifications
  .filter((n) => {
    if (view === "inbox" || view === "sent") {
      return n.is_Drafted !== true; // Only include non-drafts in inbox/sent
    }
    return true; // For drafts view, keep all
  })
  .map(mapToDisplayFormat)
  .filter((notification): notification is NonNullable<typeof notification> => {
    if (!notification) return false;

    const matchesFilters =
      (selectedItems["Dept."].length === 0 || selectedItems["Dept."].some(item => item.toLowerCase() === notification.dept)) &&
      (selectedItems["Time"].length === 0 || selectedItems["Time"].some(item => {
        // Allow broader time categories
        if (item === "Last Week") return ["Last Hour", "Last Day", "Last Week"].includes(notification.time);
        if (item === "Last Day") return ["Last Hour", "Last Day"].includes(notification.time);
        if (item === "Last Hour") return notification.time === "Last Hour";
        return false;
      })) &&
      (selectedItems["Flags"].length === 0 || selectedItems["Flags"].some(item => item.toLowerCase() === notification.flag.toLowerCase())) &&
      (selectedItems["Read"].length === 0 || selectedItems["Read"].some(item => item.toLowerCase() === notification.read.toLowerCase()));

    const matchesSearch =
      query.trim() === "" ||
      searchResults.some(result => result.notification_id === notification.notification_id);

    return matchesFilters && matchesSearch;
  });

  console.log("Current view:", view);
  console.log("Filtered notifications:", filteredNotifications);

  const handleDraftClick = (notification: Notification) => {
    // Extract draft data from the notification
    const draftData = {
      notificationType: notification.notification_type,
      title: notification.subject,
      body: notification.details?.body || "",
      policyId: notification.details?.policy_id?.toString() || "",
      expirationDate: notification.details?.expiration_Date || "",
      type: notification.details?.type || "",
      newsdetails: notification.details?.details || "",
      insuredName: notification.details?.insured_Name || "",
      claimantName: notification.details?.claimant_Name || "",
      taskType: notification.details?.task_Type || "",
      dueDate: notification.details?.due_Date || "",
      lineBusiness: notification.details?.line_Business || "",
      description: notification.details?.description || "",
      flag: notification.flag || "normal",
      selectedUsers: notification.sent_to || [],
    };
    setSelectedDraft(notification);
    setShowComposeModal(true);
  };

  return (
    <section className="flex-1 h-full">
      {selectedNotification ? (
        <NotifContent
          notification={selectedNotification}
          onClose={() => {
            setSelectedNotification(null)
            fetch(`http://127.0.0.1:8000/notifications/${selectedNotification.notification_id}/read`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
            })
          }}
        />
      ) : (
        <>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={setSearchResults}
          />
  
          {view === "inbox" ? (
            <>
              {/* Filter Buttons */}
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
  
              {/* Inbox Notifications */}
              <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden" style={{ maxHeight: "600px" }}>
              {isLoading ? (
                  <p className="text-center text-gray-500">Loading notifications...</p>
                ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : filteredNotifications.length === 0 ? (
                  <p className="text-center text-gray-500">No notifications found.</p>
                ) : (
                  filteredNotifications.reverse().map((notification, index) => (
                    <NotificationCard
                      key={index}
                      appName={notification.App_type}
                      sender={notification.Sender_email}
                      subject={notification.subject}
                      preview={notification.preview}
                      date={new Date(notification.date_Created).toLocaleDateString()}
                      department={notification.notification_type}
                      isRead={notification.isRead}
                      onClick={() => setSelectedNotification(notification)}
                      isSent={false}
                      recipients={[]}
                      flag={notification.flag}
                    />
                  ))
                )}
              </div>
            </>
          ) : view === "sent" ? (
            <>
              {/* Sent Notifications */}
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
                    <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "600px" }}>
                      {filteredNotifications.reverse().map((notification, index) => (
                        <NotificationCard
                          key={index}
                          appName={notification.App_type}
                          sender={notification.Sender_email}
                          subject={notification.subject}
                          preview={notification.preview}
                          date={new Date(notification.date_Created).toLocaleDateString()}
                          department={notification.notification_type}
                          isRead={notification.isRead}
                          onClick={() => setSelectedNotification(notification)}
                          isSent={true}
                          recipients={notification.sent_to || []}
                          flag={notification.flag}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : view === "drafts" ? (
            <>
              {/* Draft Notifications */}
              <div className="flex flex-col items-center w-full pt-8">
                <div className="w-full max-w-4xl px-4">
                  <h2 className="text-2xl font-semibold mb-6 text-center">Draft Notifications</h2>
                  {isLoading ? (
                    <p className="text-center text-gray-500">Loading draft notifications...</p>
                  ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                  ) : notifications.filter((n) => n.is_Drafted === true).length === 0 ? (
                    <p className="text-center text-gray-500">No draft notifications found.</p>
                  ) : (
                    <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "600px" }}>
                      {notifications
                        .filter((n) => n.is_Drafted === true).reverse()
                        .map((notification, index) => (
                          <NotificationCard
                            key={index}
                            appName={notification.App_type}
                            sender={notification.Sender_email}
                            subject={notification.subject}
                            preview={notification.details?.body || notification.details?.details || notification.details?.description || "No preview available"}
                            date={new Date(notification.date_Created).toLocaleDateString()}
                            department={notification.notification_type}
                            isRead={notification.is_Read}
                            onClick={() => handleDraftClick(notification)}
                            isSent={false}
                            recipients={[]}
                            flag={notification.flag}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-semibold mb-4">No view selected</h2>
              <p className="text-gray-500">Please select Inbox, Sent, or Drafts.</p>
            </div>
          )}
        </>
      )}

      {showComposeModal && (
        <ComposeModal 
          onClose={() => {
            setShowComposeModal(false);
            setSelectedDraft(null);
          }}
          draftData={selectedDraft ? {
            notificationType: selectedDraft.notification_type,
            title: selectedDraft.subject,
            body: selectedDraft.details?.body || "",
            policyId: selectedDraft.details?.policy_id?.toString() || "",
            expirationDate: selectedDraft.details?.expiration_Date || "",
            type: selectedDraft.details?.type || "",
            newsdetails: selectedDraft.details?.details || "",
            insuredName: selectedDraft.details?.insured_Name || "",
            claimantName: selectedDraft.details?.claimant_Name || "",
            taskType: selectedDraft.details?.task_Type || "",
            dueDate: selectedDraft.details?.due_Date || "",
            lineBusiness: selectedDraft.details?.line_Business || "",
            description: selectedDraft.details?.description || "",
            flag: selectedDraft.flag || "normal",
            selectedUsers: selectedDraft.sent_to || [],
          } : undefined}
        />
      )}
    </section>
  );
};