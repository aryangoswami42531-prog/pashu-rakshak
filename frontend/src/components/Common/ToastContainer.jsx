import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full px-4">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            toast.type === 'error' || toast.type === 'critical'
              ? 'bg-bioalert-900/90 border-bioalert-500 text-red-100'
              : toast.type === 'success'
              ? 'bg-agri-900/90 border-agri-500 text-emerald-100'
              : 'bg-slate-800/90 border-slate-600 text-slate-100'
          }`}
        >
          {toast.type === 'error' || toast.type === 'critical' ? (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          ) : toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          )}
          <div className="text-sm font-medium leading-relaxed">
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
};
