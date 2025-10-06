/**
 * Modern dialog utilities to replace legacy confirm() and alert() dialogs
 *
 * Usage examples:
 *
 * // Basic confirmation
 * const confirmed = await confirm("Delete this item?");
 *
 * // Delete confirmation with item name
 * const confirmed = await confirmDelete("My Photo");
 *
 * // Alert dialogs
 * await alert("Success!", "Your changes have been saved.", "success");
 * await alert("Warning", "This action is not recommended.", "warning");
 * await alert("Error", "Something went wrong.", "error");
 *
 * Note: These functions can only be used within components wrapped by DialogProvider
 */

import { useDialog } from "@/components/ui/dialog-provider";

export const useModernDialogs = () => {
  const { confirm, alert, confirmDelete } = useDialog();

  return {
    /**
     * Show a confirmation dialog
     * @param title - The dialog title
     * @param description - Optional description text
     * @returns Promise<boolean> - true if user confirmed, false if cancelled
     */
    confirm,

    /**
     * Show an alert dialog
     * @param title - The alert title
     * @param description - Optional description text
     * @param type - Alert type: 'info' | 'success' | 'error' | 'warning'
     * @returns Promise<void>
     */
    alert,

    /**
     * Show a delete confirmation dialog
     * @param itemName - Name of the item being deleted
     * @returns Promise<boolean> - true if user confirmed, false if cancelled
     */
    confirmDelete,
  };
};

/**
 * Legacy browser dialog replacements
 * These functions provide the same API as native confirm() and alert()
 * but with modern, theme-aware dialogs
 */
export const modernConfirm = async (message: string): Promise<boolean> => {
  // This function should only be called within a component context
  throw new Error(
    "modernConfirm must be used with useModernDialogs hook within a React component"
  );
};

export const modernAlert = async (message: string): Promise<void> => {
  // This function should only be called within a component context
  throw new Error(
    "modernAlert must be used with useModernDialogs hook within a React component"
  );
};
