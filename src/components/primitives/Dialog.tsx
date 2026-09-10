import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'primary' | 'warning';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'primary',
  icon,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex min-h-full items-center justify-center p-4 text-center sm:p-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Dialog Card */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative transform overflow-hidden rounded-xl bg-[var(--surface-raised)] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-[var(--border-subtle)] z-10"
          >
            <div className="p-6">
              <div className="sm:flex sm:items-start gap-4">
                {icon ? (
                  <div className="shrink-0">{icon}</div>
                ) : variant === 'danger' || variant === 'warning' ? (
                  <div
                    className={`mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:mx-0 ${
                      variant === 'danger'
                        ? 'bg-[var(--palette-rose-50)] text-[var(--palette-rose-600)]'
                        : 'bg-[var(--palette-amber-50)] text-[var(--palette-amber-600)]'
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                ) : null}

                <div className="mt-3 text-center sm:mt-0 sm:text-left flex-1">
                  <h3
                    id="dialog-title"
                    className="text-base font-semibold leading-6 text-[var(--text-primary)] font-display"
                  >
                    {title}
                  </h3>
                  <div className="mt-2 text-sm text-[var(--text-secondary)] leading-normal">
                    {description}
                  </div>
                  {children && <div className="mt-4">{children}</div>}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 rounded-md"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-[var(--surface-sunken)] px-6 py-3.5 flex flex-row-reverse gap-3 border-t border-[var(--border-subtle)]">
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
              <Button variant="secondary" onClick={onClose}>
                {cancelLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
