import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const bgClass = type === 'success' ? 'bg-green-100 text-green-800' : type === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  return (
    <div className={`${bgClass} border p-4 rounded mb-4 relative`}>
      <span>{message}</span>
      <button onClick={onClose} className="absolute top-1 right-1">✕</button>
    </div>
  );
};

export default Notification;
