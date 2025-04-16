import React from "react";

interface ClaimsFieldsProps {
  insuredName: string;
  setInsuredName: (val: string) => void;
  claimantName: string;
  setClaimantName: (val: string) => void;
  taskType: string;
  setTaskType: (val: string) => void;
  dueDate: string;
  setDueDate: (val: string) => void;
  lineBusiness: string;
  setLineBusiness: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  onBlurTaskType?: () => void; // Added
  onBlurDueDate?: () => void; // Added
  onBlurInsuredName?: () => void; // Added
  onBlurClaimantName?: () => void; // Added
  onBlurDescription?: () => void; // Added
}

const ClaimsFields: React.FC<ClaimsFieldsProps> = ({
  insuredName,
  setInsuredName,
  claimantName,
  setClaimantName,
  taskType,
  setTaskType,
  dueDate,
  setDueDate,
  lineBusiness,
  setLineBusiness,
  description,
  setDescription,
  onBlurTaskType,
  onBlurDueDate,
  onBlurInsuredName,
  onBlurClaimantName,
  onBlurDescription,
}) => {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <input
        type="text"
        placeholder="Insured Name"
        value={insuredName}
        onChange={(e) => setInsuredName(e.target.value)}
        onBlur={onBlurInsuredName} // Added
        className="p-2 rounded border border-gray-300 text-black"
      />
      <input
        type="text"
        placeholder="Claimant Name"
        value={claimantName}
        onChange={(e) => setClaimantName(e.target.value)}
        onBlur={onBlurClaimantName} // Added
        className="p-2 rounded border border-gray-300 text-black"
      />
      <input
        type="text"
        placeholder="Task Type"
        value={taskType}
        onChange={(e) => setTaskType(e.target.value)}
        onBlur={onBlurTaskType} // Existing
        className="p-2 rounded border border-gray-300 text-black"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        onBlur={onBlurDueDate} // Added
        className="p-2 rounded border border-gray-300 text-black"
      />
      <input
        type="text"
        placeholder="Line of Business"
        value={lineBusiness}
        onChange={(e) => setLineBusiness(e.target.value)}
        className="p-2 rounded border border-gray-300 text-black"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={onBlurDescription} // Added
        className="p-2 rounded border border-gray-300 text-black resize-none flex-1"
      />
    </div>
  );
};

export default ClaimsFields;
