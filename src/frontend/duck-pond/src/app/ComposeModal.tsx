import React, { useState } from "react";

interface ComposeModalProps {
  onClose: () => void;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ onClose }) => {
  const [notificationType, setNotificationType] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");

  // ✨ NEW FOR CLAIMS
  const [claimId, setClaimId] = useState("");
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    let notification: any = {};

    if (notificationType === "policy") {
      notification = {
        notification_id: 1,
        Recipient_id: 1,
        Sender_id: 0,
        App_type: "DuckPond",
        date_Created: new Date().toISOString(),
        subject: title,
        body: body,
        is_Read: false,
        is_Archived: false,
        policy_id: parseInt(policyId),
      };
    } else if (notificationType === "news") {
      notification = {
        userId: "1",
        is_Read: false,
        created_Date: new Date().toISOString(),
        expiration_Date: new Date(expirationDate).toISOString(),
        type: type,
        title: title,
        details: details,
      };
    } else if (notificationType === "claims") {
      // ✨ NEW FOR CLAIMS
      notification = {
        claim_id: parseInt(claimId),
        status: status,
        amount: parseFloat(amount),
        is_Read: false,
        is_Archived: false,
      };
    } else {
      alert("Please select a notification type.");
      return;
    }

    console.log("Sending:", notificationType, notification);

    const response = await fetch(`http://127.0.0.1:8000/notifications/${notificationType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    });

    if (response.ok) {
      console.log("Notification posted!");
      onClose();
      // Reset fields
      setTitle("");
      setBody("");
      setPolicyId("");
      setExpirationDate("");
      setDetails("");
      setClaimId("");        // ✨
      setStatus("");         // ✨
      setAmount("");         // ✨
      setNotificationType("");
    } else {
      const err = await response.text();
      console.error("Failed to send notification:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#F5EFFF] rounded-xl p-6 w-[600px] h-auto shadow-lg relative flex flex-col gap-2">
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={onClose}>
          ✕
        </button>

        {/* Logo + Title */}
        <div className="flex items-center mb-2">
          <img src="/DP_Logo_White.png" alt="Logo" className="h-6" />
          <h2 className="ml-2 text-xl font-semibold text-black">Compose</h2>
        </div>

        {/* Type Selector */}
        <select
          value={notificationType}
          onChange={(e) => setNotificationType(e.target.value)}
          className="mb-2 p-2 rounded border border-gray-300 text-black"
        >
          <option value="">Select Type</option>
          <option value="policy">Policy</option>
          <option value="news">News</option>
          <option value="claims">Claims</option> {/* ✨ NEW OPTION */}
        </select>

        {/* Policy Fields */}
        {notificationType === "policy" && (
          <>
            <input
              type="text"
              placeholder="Policy ID"
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
              className="p-2 rounded border border-gray-300 text-black"
            />
            <input
              type="text"
              placeholder="Subject"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 rounded border border-gray-300 text-black"
            />
            <textarea
              placeholder="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="p-2 rounded border border-gray-300 text-black resize-none"
            />
          </>
        )}

        {/* News Fields */}
        {notificationType === "news" && (
          <>
            <input
              type="text"
              placeholder="Expiration Date (YYYY-MM-DD)"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="p-2 rounded border border-gray-300 text-black"
            />
            <input
              type="text"
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-2 rounded border border-gray-300 text-black"
            />
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 rounded border border-gray-300 text-black"
            />
            <textarea
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="p-2 rounded border border-gray-300 text-black resize-none"
            />
          </>
        )}

        {/* ✨ Claims Fields */}
        {notificationType === "claims" && (
          <>
            <input
              type="text"
              placeholder="Claim ID"
              value={claimId}
              onChange={(e) => setClaimId(e.target.value)}
              className="p-2 rounded border border-gray-300 text-black"
            />
            <input
              type="text"
              placeholder="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 rounded border border-gray-300 text-black"
            />
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-2 rounded border border-gray-300 text-black"
            />
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button className="bg-dcpurple text-white py-1 px-4 rounded-full" onClick={handleSubmit}>
            Send
          </button>
          <button className="border border-dcpurple text-dcpurple py-1 px-4 rounded-full">
            Draft
          </button>
          <button className="bg-dcpurple text-white py-1 px-4 rounded-full">
            Copilot ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeModal;