/**
 * Load Cashfree script dynamically
 * This function loads the Cashfree checkout script only when needed
 */
export function loadCashfree(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if Cashfree is already loaded
    if (typeof window !== "undefined" && window.Cashfree) {
      resolve(true);
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.error("Failed to load Cashfree SDK");
      resolve(false);
    };

    document.body.appendChild(script);
  });
}
