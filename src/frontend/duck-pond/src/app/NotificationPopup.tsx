interface NotificationPopupProps {
    notification: any;
    onClose: () => void;
  }
  
  const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-xl">
          <button onClick={onClose} className="absolute top-2 right-4 text-xl">✕</button>
          <h2 className="text-2xl font-bold mb-2">{notification.title || notification.subject}</h2>
          <p className="text-sm text-gray-500 mb-1">
            From: {notification.Sender_id === 0 ? "DuckPond Bot" : `User ${notification.Sender_id}`} • {notification.department}
          </p>
          <p className="text-sm text-gray-500 mb-4">Date: {new Date(notification.date_Created).toLocaleDateString()}</p>
          <div className="text-gray-700 whitespace-pre-wrap">
            {notification.body || notification.details || notification.description}
          </div>
        </div>
      </div>
    );
  };
  
  export default NotificationPopup;
  