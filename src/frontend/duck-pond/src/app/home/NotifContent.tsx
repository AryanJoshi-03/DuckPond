import React from 'react';

interface NotifContentProps {
    notification: any;
    onClose: () => void;
}

const NotifContent: React.FC<NotifContentProps> = ({ notification, onClose }) => {
    if (!notification) {
        return (
            <div className="h-full w-full flex flex-col">
                <div className="p-4 bg-white rounded-lg shadow-md flex-1 overflow-auto">
                    <button 
                        onClick={onClose}
                        className="mb-6 flex items-center text-dcpurple hover:text-purple-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Notifications
                    </button>
                    <div className="text-center text-gray-500 mt-10">
                        <p className="text-xl">No notification details available</p>
                    </div>
                </div>
            </div>
        );
    }

    // Extract data from notification object with fallbacks
    const subject = notification.subject || 'No Subject';
    const sender = notification.Sender_email || "DuckPond Bot";
    const timeSent = notification.date_Created ? new Date(notification.date_Created).toLocaleDateString() : 'Unknown date';
    const department = notification.notification_type || 'General';
    
    // Check if this is a sent notification
    const isSent = notification.sent_to && Array.isArray(notification.sent_to) && notification.sent_to.length > 0;
    
    // Safely extract message with fallbacks
    let message = 'No message content available';
    if (notification.details) {
        if (notification.details.body) {
            message = notification.details.body;
        } else if (notification.details.details) {
            message = notification.details.details;
        } else if (notification.details.description) {
            message = notification.details.description;
        }
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="p-4 bg-white rounded-lg shadow-md flex-1 overflow-auto">
                <button 
                    onClick={onClose}
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
                        {isSent ? (
                            <span>To: {notification.sent_to.join(', ')}</span>
                        ) : (
                            <span>From: {sender}</span>
                        )}
                        <span>Department: {department}</span>
                        <span>Sent: {timeSent}</span>
                    </div>
                </div>
                <div className="mt-6 border-t pt-6">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{message}</p>
                </div>
            </div>
        </div>
    );
};


export default NotifContent;