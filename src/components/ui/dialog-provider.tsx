"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
} from "lucide-react";

type DialogType =
  | "confirm"
  | "alert"
  | "success"
  | "error"
  | "warning"
  | "info";

interface DialogConfig {
  type: DialogType;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: "default" | "destructive";
}

interface DialogContextType {
  showDialog: (config: DialogConfig) => Promise<boolean>;
  confirm: (title: string, description?: string) => Promise<boolean>;
  alert: (
    title: string,
    description?: string,
    type?: "info" | "success" | "error" | "warning"
  ) => Promise<void>;
  confirmDelete: (itemName: string) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | null>(null);

interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DialogConfig | null>(null);
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const showDialog = (dialogConfig: DialogConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig(dialogConfig);
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  };

  const confirm = (
    title: string,
    description: string = "This action cannot be undone."
  ): Promise<boolean> => {
    return showDialog({
      type: "confirm",
      title,
      description,
      confirmText: "Continue",
      cancelText: "Cancel",
    });
  };

  const alert = (
    title: string,
    description: string = "",
    type: "info" | "success" | "error" | "warning" = "info"
  ): Promise<void> => {
    return new Promise((resolve) => {
      showDialog({
        type: type,
        title,
        description,
        confirmText: "OK",
      }).then(() => resolve());
    });
  };

  const confirmDelete = (itemName: string): Promise<boolean> => {
    return showDialog({
      type: "confirm",
      title: `Delete ${itemName}?`,
      description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
  };

  const handleConfirm = async () => {
    if (config?.onConfirm) {
      await config.onConfirm();
    }
    setIsOpen(false);
    resolvePromise?.(true);
    cleanup();
  };

  const handleCancel = () => {
    if (config?.onCancel) {
      config.onCancel();
    }
    setIsOpen(false);
    resolvePromise?.(false);
    cleanup();
  };

  const cleanup = () => {
    setConfig(null);
    setResolvePromise(null);
  };

  const getIcon = () => {
    switch (config?.type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-rose-600" />;
      case "confirm":
        return config.variant === "destructive" ? (
          <Trash2 className="h-6 w-6 text-red-600" />
        ) : (
          <AlertCircle className="h-6 w-6 text-blue-600" />
        );
      case "info":
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getConfirmVariant = () => {
    if (config?.variant === "destructive") return "destructive";
    if (config?.type === "error") return "destructive";
    return "default";
  };

  return (
    <DialogContext.Provider
      value={{ showDialog, confirm, alert, confirmDelete }}
    >
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              {getIcon()}
              <AlertDialogTitle className="text-left">
                {config?.title}
              </AlertDialogTitle>
            </div>
            {config?.description && (
              <AlertDialogDescription className="text-left">
                {config.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {config?.type === "confirm" && (
              <AlertDialogCancel onClick={handleCancel}>
                {config?.cancelText || "Cancel"}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                getConfirmVariant() === "destructive"
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : ""
              }
            >
              {config?.confirmText || "OK"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
