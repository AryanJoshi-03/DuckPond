import React from 'react';

interface NotifContentProps {
    subject: string;
    sender: string;
    timeSent: string;
    message: string;
    onBack: () => void;
}

const NotifContent: React.FC<NotifContentProps> = ({ subject, sender, timeSent, message, onBack }) => {
    return (
        <div className="h-full w-full flex items-center justify-center p-8">
            <div className="w-full max-w-3xl">
                <div className="p-8 bg-white rounded-lg shadow-md">
                    <button 
                        onClick={onBack}
                        className="mb-6 flex items-center text-dcpurple hover:text-purple-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Notifications
                    </button>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">{subject}</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600">
                            <span>From: {sender}</span>
                            <span>Sent: {timeSent}</span>
                        </div>
                    </div>
                    <div className="mt-6 border-t pt-6">
                        <p className="text-gray-700 leading-relaxed text-lg">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotifContent;