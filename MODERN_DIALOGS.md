# Modern Dialog System

This project now uses custom, theme-aware dialog components instead of legacy browser dialogs (`confirm()`, `alert()`). The new system provides:

- 🎨 **Theme-aware**: Automatically adapts to light/dark mode
- 📱 **Mobile-friendly**: Responsive design that works on all devices
- ♿ **Accessible**: Built with proper ARIA attributes and keyboard navigation
- 🎯 **Type-safe**: Full TypeScript support with proper type definitions
- 🔧 **Customizable**: Multiple dialog types and styling options

## Components Created

### 1. AlertDialog Component (`src/components/ui/alert-dialog.tsx`)

Base shadcn/ui alert dialog component with Radix UI primitives.

### 2. DialogProvider (`src/components/ui/dialog-provider.tsx`)

React context provider that manages dialog state and provides easy-to-use hooks.

### 3. Dialog Utilities (`src/lib/dialog-utils.ts`)

Helper functions and hooks for common dialog patterns.

## Setup

The `DialogProvider` is already configured in the root layout (`src/app/layout.tsx`), so all pages and components have access to the dialog system.

## Usage

### Basic Confirmation Dialog

```tsx
import { useDialog } from "@/components/ui/dialog-provider";

function MyComponent() {
  const { confirm } = useDialog();

  const handleDeleteItem = async () => {
    const confirmed = await confirm(
      "Delete Item?",
      "This action cannot be undone."
    );

    if (confirmed) {
      // User clicked "Continue"
      deleteItem();
    }
    // User clicked "Cancel" or pressed Escape
  };

  return <button onClick={handleDeleteItem}>Delete Item</button>;
}
```

### Delete Confirmation (Pre-styled)

```tsx
import { useDialog } from "@/components/ui/dialog-provider";

function MyComponent() {
  const { confirmDelete } = useDialog();

  const handleDelete = async () => {
    const confirmed = await confirmDelete("My Photo");

    if (confirmed) {
      // User confirmed deletion
      deletePhoto();
    }
  };

  return <button onClick={handleDelete}>Delete Photo</button>;
}
```

### Alert Dialogs

```tsx
import { useDialog } from "@/components/ui/dialog-provider";

function MyComponent() {
  const { alert } = useDialog();

  const showSuccess = () => {
    alert("Success!", "Your changes have been saved.", "success");
  };

  const showError = () => {
    alert("Error", "Something went wrong. Please try again.", "error");
  };

  const showWarning = () => {
    alert("Warning", "This action is not recommended.", "warning");
  };

  const showInfo = () => {
    alert("Information", "Here's some useful information.", "info");
  };

  return (
    <div>
      <button onClick={showSuccess}>Show Success</button>
      <button onClick={showError}>Show Error</button>
      <button onClick={showWarning}>Show Warning</button>
      <button onClick={showInfo}>Show Info</button>
    </div>
  );
}
```

## Dialog Types

### Confirmation Dialog

- **Purpose**: Get user confirmation before destructive actions
- **Returns**: `Promise<boolean>` - `true` if confirmed, `false` if cancelled
- **Icon**: Question mark or warning icon based on context

### Delete Confirmation

- **Purpose**: Specialized confirmation for delete actions
- **Returns**: `Promise<boolean>` - `true` if confirmed, `false` if cancelled
- **Icon**: Trash icon with red styling
- **Button**: Red "Delete" button for clear visual indication

### Alert Dialogs

- **Purpose**: Show informational messages to users
- **Types**: `'info' | 'success' | 'error' | 'warning'`
- **Returns**: `Promise<void>` - resolves when user clicks OK
- **Icons**: Appropriate icons for each alert type

## Implementation Examples

### Gallery Page Delete

**Before:**

```tsx
const handleDelete = async (imageId: string, title: string) => {
  if (!confirm(`Are you sure you want to delete "${title}"?`)) {
    return;
  }
  // Delete logic...
};
```

**After:**

```tsx
const { confirmDelete } = useDialog();

const handleDelete = async (imageId: string, title: string) => {
  const confirmed = await confirmDelete(title);
  if (!confirmed) {
    return;
  }
  // Delete logic...
};
```

### Prompt-to-Image Reset

**Before:**

```tsx
const resetAll = () => {
  // Reset all settings immediately
  setTextPrompt("");
  // ... other resets
};
```

**After:**

```tsx
const { confirm } = useDialog();

const resetAll = async () => {
  const confirmed = await confirm(
    "Reset All Settings?",
    "This will clear all your inputs, settings, and generated images. This action cannot be undone."
  );

  if (confirmed) {
    setTextPrompt("");
    // ... other resets
    showToast.success(
      "Settings Reset",
      "All settings have been restored to default"
    );
  }
};
```

## Visual Features

### Theme Integration

- Automatically uses your app's color scheme (light/dark mode)
- Consistent with shadcn/ui design system
- Smooth animations and transitions

### Icons

- **Info**: `ℹ️` Blue info icon
- **Success**: `✅` Green checkmark
- **Warning**: `⚠️` Yellow warning triangle
- **Error**: `❌` Red X circle
- **Delete**: `🗑️` Red trash can
- **Confirm**: `❓` Blue question circle

### Styling

- **Destructive actions**: Red buttons with appropriate warning colors
- **Standard actions**: Primary theme colors
- **Responsive**: Adapts to mobile screens with proper touch targets
- **Backdrop**: Blurred background for focus

## Migration Guide

### Replace `confirm()`

```tsx
// Old
if (confirm("Are you sure?")) {
  doAction();
}

// New
const { confirm } = useDialog();
const confirmed = await confirm("Are you sure?");
if (confirmed) {
  doAction();
}
```

### Replace `alert()`

```tsx
// Old
alert("Success!");

// New
const { alert } = useDialog();
await alert("Success!", "", "success");

// Or use toast for simple notifications
import { showToast } from "@/lib/toast";
showToast.success("Success!");
```

## Best Practices

1. **Use appropriate dialog types**: Delete confirmations for destructive actions, regular confirms for other actions
2. **Provide clear descriptions**: Help users understand the consequences of their actions
3. **Use toasts for simple notifications**: Save dialogs for actions that require user input
4. **Handle cancellation gracefully**: Always check the returned boolean from confirmation dialogs
5. **Consider async nature**: Remember that dialog functions return Promises

## Error Handling

```tsx
const { confirm } = useDialog();

const handleAction = async () => {
  try {
    const confirmed = await confirm("Proceed with action?");
    if (confirmed) {
      await performAction();
      showToast.success("Action completed successfully");
    }
  } catch (error) {
    console.error("Dialog error:", error);
    showToast.error("Something went wrong");
  }
};
```

The dialog system is now fully integrated and ready to use throughout your application!
