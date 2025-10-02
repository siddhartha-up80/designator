import { toast } from "sonner";

/**
 * Custom toast utility to replace alert() calls
 * Uses Sonner for beautiful, modern notifications
 */

export const showToast = {
  /**
   * Show a success message
   */
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show an error message
   */
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    });
  },

  /**
   * Show a warning message
   */
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show an info message
   */
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a loading message
   * Returns a function to dismiss the toast
   */
  loading: (message: string) => {
    const toastId = toast.loading(message);
    return () => toast.dismiss(toastId);
  },

  /**
   * Show a promise toast (automatically handles loading, success, error)
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },
};
