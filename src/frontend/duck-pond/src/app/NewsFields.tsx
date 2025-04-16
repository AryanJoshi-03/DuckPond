import React from "react";

interface NewsFieldsProps {
  expirationDate: string;
  setExpirationDate: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  title: string;
  setTitle: (value: string) => void;
  details: string;
  setDetails: (value: string) => void;
  onBlurTitle?: () => void; // Added
  onBlurExpirationDate?: () => void; // Added
  onBlurDetails?: () => void; // Added
}

const NewsFields: React.FC<NewsFieldsProps> = ({
  expirationDate,
  setExpirationDate,
  type,
  setType,
  title,
  setTitle,
  details,
  setDetails,
  onBlurTitle,
  onBlurExpirationDate,
  onBlurDetails,
}) => {
  return (
    <div className="flex flex-col gap-3 flex-1">
      <input
        type="date"
        placeholder="Expiration Date"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
        onBlur={onBlurExpirationDate} // Added
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
        onBlur={onBlurTitle} // Added
        className="p-2 rounded border border-gray-300 text-black"
      />
      <textarea
        placeholder="Details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        onBlur={onBlurDetails} // Added
        className="p-2 rounded border border-gray-300 text-black resize-none flex-grow min-h-[180px]"
      />
    </div>
  );
};

export default NewsFields;