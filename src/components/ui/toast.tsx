import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastStyles = {
  success:
    "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-800 dark:text-green-200",
  error:
    "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-200",
  warning:
    "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/90 dark:border-yellow-800 dark:text-yellow-200",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
};

export function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = toastIcons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 transform",
        toastStyles[type],
        isVisible
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      )}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        {title && <p className="mb-1 text-sm font-medium">{title}</p>}
        <p className="text-sm break-words">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 transition-colors rounded-md hover:bg-black/10 dark:hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed z-50 w-full max-w-sm space-y-2 top-4 right-4">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
