import React from "react";

interface PolicyFieldsProps {
  policyId: string;
  setPolicyId: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  body: string;
  setBody: (val: string) => void;
}

const PolicyFields: React.FC<PolicyFieldsProps> = ({
  policyId,
  setPolicyId,
  title,
  setTitle,
  body,
  setBody,
}) => {
  return (
    <div className="flex flex-col gap-4 flex-1">
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
        className="p-2 rounded border border-gray-300 text-black resize-none flex-1"
      />
    </div>
  );
};

export default PolicyFields;
