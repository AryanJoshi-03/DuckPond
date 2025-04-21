import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import PolicyFields from "./PolicyFields";
import NewsFields from "./NewsFields";
import ClaimsFields from "./ClaimsFields";
import UserSelect from "../../components/UserSelect";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

interface ComposeModalProps {
  onClose: () => void;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, loading, isAuthenticated } = useAuth();
  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // === Notification Type State ===
  const [notificationType, setNotificationType] = useState("");

  // === Selected Users State ===
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // === Common Fields ===
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");


  // === Policy Fields ===
  const [policyId, setPolicyId] = useState("");

  // === News Fields ===
  const [expirationDate, setExpirationDate] = useState("");
  const [type, setType] = useState("");
  const [newsdetails, setDetails] = useState("");

  // === Claims Fields ===
  const [claimId, setClaimId] = useState("");
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState("");

  const [insuredName, setInsuredName] = useState("");
  const [claimantName, setClaimantName] = useState("");
  const [taskType, setTaskType] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lineBusiness, setLineBusiness] = useState("");
  const [description, setDescription] = useState("");


  // === Submit Form ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one recipient is selected
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }
    
    let notification: any = {
      Recipient_id: selectedUsers,
      flag: "none",
      Sender_id: user?.id,
      Sender_email: user?.email,
    };

    if (notificationType === "claims") {
      notification = {
        ...notification,
        subject: taskType,
        details: {
          insured_Name: insuredName,
          claimant_Name: claimantName,
          task_Type: taskType,
          due_Date: new Date(dueDate).toISOString(),
          line_Business: lineBusiness,
          description: description
        }
      };
    }

    if (notificationType === "policy") {
      notification = {
        ...notification,
        subject: title,
        details:{
          policy_id: parseInt(policyId),
          body: body,
        }
      };
    } else if (notificationType === "news") {
      notification = {
        ...notification,
        subject: title,
        details: {
          expiration_Date: new Date(expirationDate).toISOString(),
          type,
          title,
          details: newsdetails,
        },
      };
    } else if (notificationType === "claims") {
      // Validate required fields
      if (!insuredName || !claimantName || !taskType || !dueDate || !lineBusiness || !description) {
        toast.error("Please fill in all required fields for the claims notification.");
        return;
      }

      notification = {
        ...notification,
        subject: taskType,
        details: {
          insured_Name: insuredName,
          claimant_Name: claimantName,
          task_Type: taskType,
          due_Date: new Date(dueDate).toISOString(),
          line_Business: lineBusiness,
          description: description
        }
      };
    } else {
      toast.error("Please select a notification type.");
      return;
    }

    try {
      console.log("Sending notification:", notification);
      const response = await fetch(`http://127.0.0.1:8000/notifications/${notificationType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Notification posted successfully:", result);
        toast.success(`Notification sent successfully to ${selectedUsers.length} recipient(s)!`);
        onClose();
        // 🔄 Reset Fields
        setTitle(""); 
        setBody(""); 
        setPolicyId("");
        setExpirationDate(""); 
        setDetails("");
        setClaimId(""); 
        setStatus(""); 
        setAmount("");
        setInsuredName("");
        setClaimantName("");
        setTaskType("");
        setDueDate("");
        setLineBusiness("");
        setDescription("");
        setNotificationType("");
        setSelectedUsers([]);
      } else {
        const errorData = await response.json();
        console.error("Failed to send notification:", errorData);
        toast.error(`Failed to send notification: ${errorData.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error during fetch:", err);
      toast.error("An error occurred while sending the notification. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#F5EFFF] rounded-xl p-6 w-[80%] h-[80%] shadow-lg relative flex flex-col gap-4 overflow-y-auto">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-black" onClick={onClose}>
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center mb-4">
          <img 
            src={mounted && theme === "light" ? "/DP_Logo_Black.png" : "/DP_Logo_White.png"} 
            alt="Logo" 
            className="h-6" 
          />
          <h2 className="ml-2 text-2xl font-semibold text-black">Compose Notification</h2>
        </div>

        {/* Notification Type Selector */}
        <select
          value={notificationType}
          onChange={(e) => setNotificationType(e.target.value)}
          className="p-2 rounded border border-gray-300 text-black w-full"
        >
          <option value="">Select Type</option>
          <option value="policy">Policy</option>
          <option value="news">News</option>
          <option value="claims">Claims</option>
        </select>

        {/* User Selection */}
        <UserSelect
          selectedUsers={selectedUsers}
          onUserSelect={setSelectedUsers}
        />

        {/* Conditional Fields */}

        {notificationType === "" ? (
          // Placeholder content when no type is selected
          <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-500 gap-2">
             <img
              src={mounted && theme === "light" ? "/DP_Logo_Black.png" : "/DP_Logo_White.png"} 
              alt="DuckPond Logo"
              className="w-32 h-32 opacity-100"
            />
            <p className="text-lg font-medium">Select a notification type to begin composing.</p>
            <p className="text-sm text-gray-400">You'll be able to customize the message after choosing a type.</p>
          </div>
        ) : (
          <>
            {notificationType === "policy" && (
              <PolicyFields
                policyId={policyId}
                setPolicyId={setPolicyId}
                title={title}
                setTitle={setTitle}
                body={body}
                setBody={setBody}
              />
            )}

            {notificationType === "news" && (
              <NewsFields
                expirationDate={expirationDate}
                setExpirationDate={setExpirationDate}
                type={type}
                setType={setType}
                title={title}
                setTitle={setTitle}
                details={newsdetails}
                setDetails={setDetails}
              />
            )}

            {notificationType === "claims" && (
              <ClaimsFields
                insuredName={insuredName}
                setInsuredName={setInsuredName}
                claimantName={claimantName}
                setClaimantName={setClaimantName}
                taskType={taskType}
                setTaskType={setTaskType}
                dueDate={dueDate}
                setDueDate={setDueDate}
                lineBusiness={lineBusiness}
                setLineBusiness={setLineBusiness}
                description={description}
                setDescription={setDescription}
              />
            )}
            {/* Keep adding other conditional forms here */}
          </>
        )}
    
        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4">
            <button className="bg-dcpurple text-white py-1 px-4 rounded-full" onClick={handleSubmit}>
              Send
            </button>
            <button className="border border-dcpurple text-dcpurple py-1 px-4 rounded-full">
              Draft
            </button>
          </div>
          <button className="bg-dcpurple text-white py-1 px-4 rounded-full">
            Copilot ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeModal;