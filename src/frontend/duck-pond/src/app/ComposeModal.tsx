import React, { useState } from "react";
import PolicyFields from "./PolicyFields";
import NewsFields from "./NewsFields";
import ClaimsFields from "./ClaimsFields";
interface ComposeModalProps {
  onClose: () => void;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ onClose }) => {
  // === Notification Type State ===
  const [notificationType, setNotificationType] = useState("");

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

  // === Validation Handlers ===
  const validateTitle = () => {
    if (!title.trim()) {
      if (notificationType === "policy") {
        alert("Subject cannot be empty."); // Updated message for policy
      } else {
        alert("Title cannot be empty.");
      }
    }
  };

  const validateBody = () => {
    if (!body.trim()) {
      alert("Body cannot be empty.");
    }
  };

  const validatePolicyId = () => {
    if (notificationType === "policy" && (!policyId.trim() || isNaN(Number(policyId)))) {
      alert("Policy ID must be a valid number.");
    }
  };

  const validateExpirationDate = () => {
    if (notificationType === "news" && !expirationDate.trim()) {
      alert("Expiration date cannot be empty.");
    }
  };

  const validateNewsDetails = () => {
    if (notificationType === "news" && !newsdetails.trim()) {
      alert("Details cannot be empty.");
    }
  };

  const validateTaskType = () => {
    if (notificationType === "claims" && !taskType.trim()) {
      alert("Task type cannot be empty.");
    }
  };

  const validateDueDate = () => {
    if (notificationType === "claims" && !dueDate.trim()) {
      alert("Due date cannot be empty.");
    }
  };

  const validateInsuredName = () => {
    if (notificationType === "claims" && !insuredName.trim()) {
      alert("Insured name cannot be empty.");
    }
  };

  const validateClaimantName = () => {
    if (notificationType === "claims" && !claimantName.trim()) {
      alert("Claimant name cannot be empty.");
    }
  };

  const validateDescription = () => {
    if (notificationType === "claims" && !description.trim()) {
      alert("Description cannot be empty.");
    }
  };

  // === Submit Form ===
  const handleSubmit = async () => {
    const errors: string[] = [];

    // Validate fields based on notification type
    if (notificationType === "policy") {
      if (!title.trim()) errors.push("Subject cannot be empty.");
      if (!policyId.trim() || isNaN(Number(policyId))) errors.push("Policy ID must be a valid number.");
      if (!body.trim()) errors.push("Body cannot be empty.");
    } else if (notificationType === "news") {
      if (!title.trim()) errors.push("Title cannot be empty.");
      if (!expirationDate.trim()) errors.push("Expiration date cannot be empty.");
      if (!newsdetails.trim()) errors.push("Details cannot be empty.");
    } else if (notificationType === "claims") {
      if (!taskType.trim()) errors.push("Task type cannot be empty.");
      if (!dueDate.trim()) errors.push("Due date cannot be empty.");
      if (!insuredName.trim()) errors.push("Insured name cannot be empty.");
      if (!claimantName.trim()) errors.push("Claimant name cannot be empty.");
      if (!description.trim()) errors.push("Description cannot be empty.");
    } else {
      errors.push("Please select a notification type.");
    }

    // Show all errors in an alert
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    let notification: any = {
      Recipient_id: [1],
      Sender_id: 0,
      App_type: "DuckPond",
      is_Read: false,
      is_Archived: false,
      date_Created: new Date().toISOString(),
      subject: "",
      details: {},
    };

    if (notificationType === "policy") {
      notification = {
        ...notification,
        subject: title,
        details: {
          policy_id: parseInt(policyId),
          body: body,
        },
      };
    } else if (notificationType === "news") {
      notification = {
        ...notification,
        subject: title,
        details: {
          expiration_Date: new Date(expirationDate).toISOString(),
          type,
          title,
          newsdetails,
        },
      };
    } else if (notificationType === "claims") {
      notification = {
        ...notification,
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
      alert("Please select a notification type.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/notifications/${notificationType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        console.log("Notification posted!");
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
      } else {
        const err = await response.text();
        console.error("Failed to send notification:", err);
      }
    } catch (err) {
      console.error("Error during fetch:", err);
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
          <img src="/DP_Logo_White.png" alt="Logo" className="h-6" />
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

        {/* Conditional Fields */}

        {notificationType === "" ? (
          // Placeholder content when no type is selected
          <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-500 gap-2">
            <img
              src="/DP_Logo_White.png"
              alt="DuckPond Logo"
              className="w-32 h-32 opacity-100"
            />
            <p className="text-lg font-medium">Select a notification type to begin composing.</p>
            <p className="text-sm text-gray-400">You’ll be able to customize the message after choosing a type.</p>
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
                onBlurTitle={validateTitle} // Added validation
                onBlurBody={validateBody} // Added validation
                onBlurPolicyId={validatePolicyId} // Added validation
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
                onBlurTitle={validateTitle} // Existing validation
                onBlurExpirationDate={validateExpirationDate} // Existing validation
                onBlurDetails={validateNewsDetails} // Added validation
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
                onBlurTaskType={validateTaskType} // Existing validation
                onBlurDueDate={validateDueDate} // Added validation
                onBlurInsuredName={validateInsuredName} // Added validation
                onBlurClaimantName={validateClaimantName} // Added validation
                onBlurDescription={validateDescription} // Added validation
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