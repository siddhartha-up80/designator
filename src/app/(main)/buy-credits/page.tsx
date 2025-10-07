"use client";

import { useState, useEffect } from "react";
import { CREDIT_PACKAGES, type CreditPackage } from "@/lib/credit-packages";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/lib/toast";
import { useCredits } from "@/contexts/credits-context";
import { Loader2, Check, Sparkles, CreditCard } from "lucide-react";
import { loadCashfree } from "@/lib/load-cashfree";
import { useSearchParams } from "next/navigation";

export default function BuyCreditsPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const { refreshCredits } = useCredits();
  const searchParams = useSearchParams();

  // Check for payment callback
  useEffect(() => {
    const status = searchParams.get("status");
    const credits = searchParams.get("credits");

    if (status === "success" && credits) {
      showToast.success(
        "Payment Successful! 🎉",
        `${credits} credits have been added to your account.`
      );
      refreshCredits();
      // Clear URL parameters
      window.history.replaceState({}, "", "/buy-credits");
    } else if (status === "error") {
      showToast.error(
        "Payment Failed",
        "Your payment could not be completed. Please try again."
      );
      // Clear URL parameters
      window.history.replaceState({}, "", "/buy-credits");
    }
  }, [searchParams, refreshCredits]);

  const handleBuyCredits = async (pkg: CreditPackage) => {
    try {
      setLoading(true);
      setSelectedPackage(pkg.id);

      // Load Cashfree script
      const cashfreeLoaded = await loadCashfree();
      if (!cashfreeLoaded) {
        showToast.error("Failed to load payment gateway", "Please try again.");
        setLoading(false);
        setSelectedPackage(null);
        return;
      }

      // Create order
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { sessionId, orderId } = await response.json();

      // Initialize Cashfree Checkout
      const cashfree = await (window as any).Cashfree({
        mode: process.env.NODE_ENV === "production" ? "production" : "sandbox",
      });

      // Configure checkout options
      const checkoutOptions = {
        paymentSessionId: sessionId,
        returnUrl: `${window.location.origin}/api/payment/callback?order_id=${orderId}`,
      };

      // Open Cashfree checkout
      cashfree.checkout(checkoutOptions);

      // Reset loading state after checkout opens
      setTimeout(() => {
        setLoading(false);
        setSelectedPackage(null);
      }, 1000);
    } catch (error) {
      console.error("Error initiating payment:", error);
      showToast.error("Failed to initiate payment", "Please try again.");
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Buy Credits</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Purchase credits to unlock powerful AI features. All packages include
          bonus credits!
        </p>
      </div>

      {/* Credit Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative ${
              pkg.popular
                ? "border-primary shadow-lg scale-105"
                : "border-border"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Price */}
              <div className="text-center">
                <div className="text-4xl font-bold">₹{pkg.price}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  one-time payment
                </div>
              </div>

              {/* Credits */}
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary">
                  {pkg.credits + pkg.bonus}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Credits
                </div>
                {pkg.bonus > 0 && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    +{pkg.bonus} Bonus Credits!
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleBuyCredits(pkg)}
                disabled={loading}
              >
                {loading && selectedPackage === pkg.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Buy Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-secondary/30 rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">💳 Payment Information</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground mb-2">
              ✅ Secure Payment
            </h3>
            <p>
              All payments are processed securely through Cashfree. We never
              store your card details.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">
              🎁 Bonus Credits
            </h3>
            <p>
              Get up to 20% bonus credits on larger packages. The more you buy,
              the more you save!
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">
              💰 Credit Costs
            </h3>
            <ul className="space-y-1 mt-2">
              <li>• Photo Generation: 25 credits</li>
              <li>• Text Prompt: 10 credits</li>
              <li>• Photo Enhancement: 15 credits</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">
              📱 Payment Methods
            </h3>
            <p>UPI, Credit/Debit Cards, Net Banking, Wallets, and more!</p>
          </div>
        </div>
      </div>

      {/* Test Mode Banner (only show in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 bg-orange-500 border border-orange-600 rounded-lg p-4 max-w-4xl mx-auto">
          <h3 className="font-semibold text-white mb-2">🧪 Test Mode Active</h3>
          <p className="text-sm text-orange-100">
            Use test card:{" "}
            <code className="bg-white text-orange-600 px-2 py-1 rounded font-medium">
              4111 1111 1111 1111
            </code>{" "}
            or any UPI ID for testing
          </p>
        </div>
      )}
    </div>
  );
}
