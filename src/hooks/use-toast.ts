import { ToastProps, ToastType } from "@/components/ui/toast";
import { useCallback, useState } from "react";

export interface UseToastReturn {
  toasts: ToastProps[];
  showToast: (
    type: ToastType,
    message: string,
    title?: string,
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback(
    (
      type: ToastType,
      message: string,
      title?: string,
      duration: number = 5000
    ) => {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);

      const newToast: ToastProps = {
        id,
        type,
        title,
        message,
        duration,
        onClose: (toastId: string) => removeToast(toastId),
      };

      setToasts(prev => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
  };
}
