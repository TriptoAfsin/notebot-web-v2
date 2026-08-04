import { ToastAction, ToastProps, ToastType } from "@/components/ui/toast";
import { useCallback, useState } from "react";

export interface UseToastReturn {
  toasts: ToastProps[];
  showToast: (
    type: ToastType,
    message: string,
    title?: string,
    duration?: number,
    /** Adding this is what lets a reversible action ship as delete + Undo
     * instead of a confirmation dialog. */
    action?: ToastAction
  ) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  /* Declared before showToast, which closes over it. Previously showToast
   * referenced removeToast from below with an empty dep array — it worked only
   * because removeToast happens to be stable, which is exactly the kind of
   * accident that breaks on the next edit. */
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      message: string,
      title?: string,
      duration: number = 5000,
      action?: ToastAction
    ) => {
      // substr is deprecated; slice is the same thing without the legacy path
      const id =
        Date.now().toString(36) + Math.random().toString(36).slice(2, 11);

      setToasts(prev => [
        ...prev,
        { id, type, title, message, duration, action, onClose: removeToast },
      ]);
    },
    [removeToast]
  );

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
