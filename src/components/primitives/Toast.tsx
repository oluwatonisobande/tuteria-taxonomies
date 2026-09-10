import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-3 sm:items-end">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const duration = toast.durationMs ?? 4000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-[var(--palette-emerald-600)]" />,
    error: <AlertCircle className="w-5 h-5 text-[var(--palette-rose-600)]" />,
    info: <Info className="w-5 h-5 text-[var(--palette-blue-600)]" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-[var(--surface-raised)] p-4 shadow-lg border border-[var(--border-subtle)]"
      role="alert"
    >
      <div className="flex items-start">
        <div className="shrink-0">{icons[toast.type]}</div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {toast.title}
          </p>
          {toast.message && (
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {toast.message}
            </p>
          )}
        </div>
        <div className="ml-4 flex shrink-0">
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="inline-flex rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] focus:outline-hidden"
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
