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
  draftData?: {
    notificationType: string;
    title: string;
    body: string;
    policyId: string;
    expirationDate: string;
    type: string;
    newsdetails: string;
    insuredName: string;
    claimantName: string;
    taskType: string;
    dueDate: string;
    lineBusiness: string;
    description: string;
    flag: string;
    selectedUsers: string[];
  };
}

const ComposeModal: React.FC<ComposeModalProps> = ({ onClose, draftData }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, loading, isAuthenticated } = useAuth();
  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // === Notification Type State ===
  const [notificationType, setNotificationType] = useState(draftData?.notificationType || "");

  // === Selected Users State ===
  const [selectedUsers, setSelectedUsers] = useState<string[]>(draftData?.selectedUsers || []);

  // === Common Fields ===
  const [title, setTitle] = useState(draftData?.title || "");
  const [body, setBody] = useState(draftData?.body || "");

  // === Policy Fields ===
  const [policyId, setPolicyId] = useState(draftData?.policyId || "");

  // === News Fields ===
  const [expirationDate, setExpirationDate] = useState(draftData?.expirationDate || "");
  const [type, setType] = useState(draftData?.type || "");
  const [newsdetails, setDetails] = useState(draftData?.newsdetails || "");

  // === Claims Fields ===
  const [insuredName, setInsuredName] = useState(draftData?.insuredName || "");
  const [claimantName, setClaimantName] = useState(draftData?.claimantName || "");
  const [taskType, setTaskType] = useState(draftData?.taskType || "");
  const [dueDate, setDueDate] = useState(draftData?.dueDate || "");
  const [lineBusiness, setLineBusiness] = useState(draftData?.lineBusiness || "");
  const [description, setDescription] = useState(draftData?.description || "");

  const [flag, setFlag] = useState(draftData?.flag || "normal");

  const handleSaveDraft = async () => {
    try {
      if (!notificationType) {
        toast.error("Please select a notification type first!");
        return;
      }
  
      let draftNotification: any = {
        Recipient_id: [user?.id], // Save to yourself
        flag: flag,
        Sender_id: user?.id,
        Sender_email: user?.email,
        is_Drafted: true, // ⭐ SAVE AS DRAFT
      };
  
      if (notificationType === "policy") {
        draftNotification = {
          ...draftNotification,
          subject: title,
          details: {
            policy_id: parseInt(policyId),
            body: body,
          },
        };
      } else if (notificationType === "news") {
        draftNotification = {
          ...draftNotification,
          subject: title,
          details: {
            expiration_Date: new Date(expirationDate).toISOString(),
            type,
            title,
            details: newsdetails,
          },
        };
      } else if (notificationType === "claims") {
        draftNotification = {
          ...draftNotification,
          subject: taskType,
          details: {
            insured_Name: insuredName,
            claimant_Name: claimantName,
            task_Type: taskType,
            due_Date: new Date(dueDate).toISOString(),
            line_Business: lineBusiness,
            description: description,
          },
        };
      } else {
        toast.error("Invalid notification type.");
        return;
      }
  
      const res = await fetch(`http://127.0.0.1:8000/notifications/${notificationType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftNotification),
      });
  
      if (res.ok) {
        console.log("Draft saved successfully!");
        toast.success("Draft saved successfully!");
        onClose();
      } else {
        console.error("Failed to save draft.");
        toast.error("Failed to save draft.");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Error saving draft.");
    }
  };
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
      flag: flag,
      Sender_id: user?.id,
      Sender_email: user?.email,
      is_Drafted: false,
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

  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [copilotInput, setCopilotInput] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [lastAIResponse, setLastAIResponse] = useState<any>(null);
  const [isAISuggested, setIsAISuggested] = useState(false);
  const [originalFormState, setOriginalFormState] = useState<any>(null);
  const [defaultFlag, setDefaultFlag] = useState("normal");

  // Load preferences
  useEffect(() => {
    const savedDefaultFlag = localStorage.getItem("defaultFlag");
    if (savedDefaultFlag) {
      setDefaultFlag(savedDefaultFlag);
      // Only set the flag if we're not loading a draft
      if (!draftData) {
        setFlag(savedDefaultFlag);
      }
    }
  }, [draftData]);

  // Update flag when default flag changes
  useEffect(() => {
    if (!draftData) {
      setFlag(defaultFlag);
    }
  }, [defaultFlag, draftData]);

  const typeWriterEffect = (fullText: string) => {
    let index = 0;
    // Base speed for short messages, gets faster as text gets longer
    const baseSpeed = 30; // ms
    const lengthFactor = Math.max(1, Math.log10(fullText.length)); // Logarithmic scaling based on text length
    
    setTypingMessage(""); // Clear any old typing
  
    const interval = setInterval(() => {
      setTypingMessage(fullText.slice(0, index + 1));
  
      // Calculate dynamic speed - faster as we progress through longer messages
      const currentSpeed = Math.max(5, baseSpeed / lengthFactor);
      
      index++;
  
      if (index >= fullText.length) {
        clearInterval(interval);
        setCopilotMessages(prev => [...prev, { role: "assistant", content: fullText }]);
        setTypingMessage(""); // Clear temporary typing message
      }
    }, Math.max(5, baseSpeed / lengthFactor)); // Minimum speed of 5ms, gets faster based on length
  };
  
  // Function to save current form state
  const saveFormState = () => {
    return {
      notificationType,
      title,
      body,
      flag,
      policyId,
      expirationDate,
      type,
      newsdetails,
      insuredName,
      claimantName,
      taskType,
      dueDate,
      lineBusiness,
      description,
      selectedUsers
    };
  };

  // Function to restore form state
  const restoreFormState = (state: any) => {
    setNotificationType(state.notificationType);
    setTitle(state.title);
    setBody(state.body);
    setFlag(state.flag);
    setPolicyId(state.policyId);
    setExpirationDate(state.expirationDate);
    setType(state.type);
    setDetails(state.newsdetails);
    setInsuredName(state.insuredName);
    setClaimantName(state.claimantName);
    setTaskType(state.taskType);
    setDueDate(state.dueDate);
    setLineBusiness(state.lineBusiness);
    setDescription(state.description);
    setSelectedUsers(state.selectedUsers);
  };

  const handleSendMessage = async () => {
    if (copilotInput.trim() === "") return;
  
    try {
      // Save current form state before AI changes
      setOriginalFormState(saveFormState());
      
      // Show user's message
      setCopilotMessages((prev) => [...prev, { role: "user", content: copilotInput }]);
  
      const userInput = copilotInput;
      setCopilotInput("");
  
      const response = await fetch("http://localhost:5000/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const aiResponse = data.response;
  
        try {
          const parsedResponse = JSON.parse(aiResponse);
          setLastAIResponse(parsedResponse);
          
          // Apply AI suggestions to form
          if (parsedResponse.notificationType) setNotificationType(parsedResponse.notificationType);
          if (parsedResponse.title) setTitle(parsedResponse.title);
          if (parsedResponse.body) setBody(parsedResponse.body);
          if (parsedResponse.flag) setFlag(parsedResponse.flag);
          if (parsedResponse.policyId) setPolicyId(parsedResponse.policyId);
          if (parsedResponse.expirationDate) setExpirationDate(parsedResponse.expirationDate);
          if (parsedResponse.type) setType(parsedResponse.type);
          if (parsedResponse.newsdetails) setDetails(parsedResponse.newsdetails);
          if (parsedResponse.insuredName) setInsuredName(parsedResponse.insuredName);
          if (parsedResponse.claimantName) setClaimantName(parsedResponse.claimantName);
          if (parsedResponse.taskType) setTaskType(parsedResponse.taskType);
          if (parsedResponse.dueDate) setDueDate(parsedResponse.dueDate);
          if (parsedResponse.lineBusiness) setLineBusiness(parsedResponse.lineBusiness);
          if (parsedResponse.description) setDescription(parsedResponse.description);
          if (parsedResponse.selectedUsers) setSelectedUsers(parsedResponse.selectedUsers);
          
          setIsAISuggested(true);
          toast.success("AI suggestions applied to form. Review and accept or reject changes.");
        } catch (parseError) {
          console.log("Response is not in JSON format, showing as message");
        typeWriterEffect(aiResponse);
        }
      } else {
        console.error("API error:", data.error);
        toast.error("Failed to generate notification content.");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  const handleAcceptChanges = () => {
    setIsAISuggested(false);
    setLastAIResponse(null);
    setOriginalFormState(null);
    toast.success("Changes accepted!");
  };

  const handleRejectChanges = () => {
    if (originalFormState) {
      restoreFormState(originalFormState);
    }
    setIsAISuggested(false);
    setLastAIResponse(null);
    setOriginalFormState(null);
    toast.success("Changes rejected and original form restored.");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={`bg-[#F5EFFF] rounded-xl p-6 ${copilotOpen ? "w-[70%]" : "w-[80%]"} h-[80%] shadow-lg relative flex flex-col gap-4 overflow-y-auto transition-all duration-300`}>
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
        <div className="flex gap-4">
        <select
          value={notificationType}
          onChange={(e) => setNotificationType(e.target.value)}
            className="p-2 rounded border border-gray-300 text-black flex-1"
        >
          <option value="">Select Type</option>
          <option value="policy">Policy</option>
          <option value="news">News</option>
          <option value="claims">Claims</option>
        </select>

          {/* Flag Selector */}
          <select
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            className="p-2 rounded border border-gray-300 text-black w-48"
          >
            <option value="normal">Normal</option>
            <option value="important">Important</option>
            <option value="info">Info</option>
          </select>
        </div>

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
            <button 
              onClick={handleSaveDraft}
              className="border border-dcpurple text-dcpurple py-1 px-4 rounded-full"
            >
              Save Draft
            </button>
            {isAISuggested && (
              <>
                <button 
                  onClick={handleAcceptChanges}
                  className="bg-green-500 text-white py-1 px-4 rounded-full hover:bg-green-600 transition-colors"
                >
                  ✓ Accept AI Changes
                </button>
                <button 
                  onClick={handleRejectChanges}
                  className="bg-red-500 text-white py-1 px-4 rounded-full hover:bg-red-600 transition-colors"
                >
                  ✕ Reject Changes
                </button>
              </>
            )}
          </div> 
            <button 
            className="bg-dcpurple text-white py-1 px-4 rounded-full" 
            onClick={() => setCopilotOpen(true)}
            >
              Copilot ✨
            </button>
        </div>
      </div>

        {copilotOpen && (
        <div className={`bg-white dark:bg-gray-800 h-full w-[30%] rounded-xl ml-4 flex flex-col shadow-lg overflow-hidden`}>
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Copilot ✨</h3>
            <button onClick={() => setCopilotOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
          {copilotMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-2 max-w-[80%] ${
                msg.role === "user" 
                  ? "bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-gray-100 self-end" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {typingMessage && (
            <div className="rounded-lg p-2 max-w-[80%] bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start">
              <pre className="whitespace-pre-wrap">{typingMessage}</pre>
            </div>
          )}
        </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <input
              type="text"
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Type a message..."
            />
            <button 
              onClick={handleSendMessage} 
              className="bg-dcpurple text-white rounded-full px-4 py-2 hover:bg-purple-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}



    </div>
  );
};

export default ComposeModal;