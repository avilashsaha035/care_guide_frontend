import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const bgStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }[type];

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  }[type];

  return (
    <div className={`flex items-center justify-between p-3.5 rounded-lg border text-sm my-3 ${bgStyles}`}>
      <div className="flex items-center gap-2.5">
        {icons}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
