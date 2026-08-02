import React from 'react';
import { ToastMessage } from '../../types/designSystem';
import { CheckCircle2, AlertTriangle, XCircle, Info, Sparkles, X } from 'lucide-react';

interface ToastSystemProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastSystem: React.FC<ToastSystemProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-cyan-500/40 bg-slate-900/95 text-cyan-300';
        let iconColor = 'text-cyan-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/40 bg-slate-900/95 text-emerald-300';
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500/40 bg-slate-900/95 text-amber-300';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-red-500/40 bg-slate-900/95 text-red-300';
          iconColor = 'text-red-400';
        } else if (toast.type === 'ai') {
          Icon = Sparkles;
          borderClass = 'border-purple-500/40 bg-slate-900/95 text-purple-300';
          iconColor = 'text-purple-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border rounded-lg p-3.5 shadow-2xl backdrop-blur-md flex items-start justify-between space-x-3 transition-all transform animate-in slide-in-from-bottom-5 font-sans ${borderClass}`}
          >
            <div className="flex items-start space-x-3">
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
              <div>
                <h5 className="text-xs font-bold text-white font-mono">{toast.title}</h5>
                {toast.description && (
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-sans">{toast.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
