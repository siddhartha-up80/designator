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
import {
  Loader2,
  Check,
  Sparkles,
  CreditCard,
  DollarSign,
  IndianRupee,
} from "lucide-react";
import { loadCashfree } from "@/lib/load-cashfree";
import { useSearchParams } from "next/navigation";

type Currency = "INR" | "USD";

export default function BuyCreditsPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("INR");
  const { refreshCredits } = useCredits();
  const searchParams = useSearchParams();

  // Currency conversion rate (1 USD = 83 INR approximately)
  const USD_TO_INR = 83;

  // Convert INR to USD with smart rounding
  const convertToUSD = (inrPrice: number): number => {
    const usdPrice = inrPrice / USD_TO_INR;

    // Round to nearest .99 or .49 for pricing psychology
    if (usdPrice < 10) {
      // For small amounts, round to .99
      return Math.ceil(usdPrice) - 0.01;
    } else if (usdPrice < 50) {
      // Round to nearest .99
      return Math.round(usdPrice) - 0.01;
    } else {
      // For larger amounts, round to nearest 5 or 10
      const rounded = Math.round(usdPrice / 5) * 5;
      return rounded - 0.01;
    }
  };

  // Get display price based on currency
  const getDisplayPrice = (inrPrice: number): string => {
    if (currency === "INR") {
      return `₹${inrPrice}`;
    } else {
      return `$${convertToUSD(inrPrice).toFixed(2)}`;
    }
  };

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
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
          Buy Credits
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
          <span className="hidden sm:inline">
            Purchase credits to unlock powerful AI features. All packages
            include bonus credits!
          </span>
          <span className="sm:hidden">
            Get credits to unlock AI features with bonus credits included!
          </span>
        </p>

        {/* Currency Toggle */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Currency:
          </span>
          <div className="inline-flex rounded-lg border border-border bg-background p-0.5 sm:p-1">
            <Button
              variant={currency === "INR" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrency("INR")}
              className={`h-7 sm:h-8 px-2.5 sm:px-3 text-xs sm:text-sm ${
                currency === "INR"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IndianRupee className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="hidden sm:inline">INR</span>
              <span className="sm:hidden">₹</span>
            </Button>
            <Button
              variant={currency === "USD" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrency("USD")}
              className={`h-7 sm:h-8 px-2.5 sm:px-3 text-xs sm:text-sm ${
                currency === "USD"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="hidden sm:inline">USD</span>
              <span className="sm:hidden">$</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-12">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative ${
              pkg.popular
                ? "border-primary shadow-lg sm:scale-105"
                : "border-border"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-primary text-primary-foreground px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 text-xs sm:text-sm">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                  <span className="hidden sm:inline">Most Popular</span>
                  <span className="sm:hidden">Popular</span>
                </Badge>
              </div>
            )}

            <CardHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3 md:pb-4">
              <CardTitle className="text-lg sm:text-xl md:text-2xl">
                {pkg.name}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {pkg.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
              {/* Price */}
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {getDisplayPrice(pkg.price)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  one-time payment
                </div>
              </div>

              {/* Credits */}
              <div className="bg-secondary/50 rounded-lg p-2.5 sm:p-3 md:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {pkg.credits + pkg.bonus}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Total Credits
                </div>
                {pkg.bonus > 0 && (
                  <div className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 mt-0.5 sm:mt-1">
                    +{pkg.bonus} Bonus Credits!
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-1.5 sm:space-y-2">
                {pkg.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm"
                  >
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-3 sm:p-4 md:p-6 pt-0">
              <Button
                className="w-full h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                size="lg"
                onClick={() => handleBuyCredits(pkg)}
                disabled={loading}
              >
                {loading && selectedPackage === pkg.id ? (
                  <>
                    <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                    <span className="hidden sm:inline">Processing...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Buy Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-secondary/30 rounded-lg p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
          💳 Payment Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground mb-1.5 sm:mb-2 text-xs sm:text-sm">
              ✅ Secure Payment
            </h3>
            <p className="leading-relaxed">
              All payments are processed securely through Cashfree. We never
              store your card details.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1.5 sm:mb-2 text-xs sm:text-sm">
              🎁 Bonus Credits
            </h3>
            <p className="leading-relaxed">
              Get up to 20% bonus credits on larger packages. The more you buy,
              the more you save!
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1.5 sm:mb-2 text-xs sm:text-sm">
              💰 Credit Costs
            </h3>
            <ul className="space-y-0.5 sm:space-y-1 mt-1.5 sm:mt-2 leading-relaxed">
              <li>• Photo Generation: 25 credits</li>
              <li>• Text Prompt: 10 credits</li>
              <li>• Photo Enhancement: 15 credits</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1.5 sm:mb-2 text-xs sm:text-sm">
              📱 Payment Methods
            </h3>
            <p className="leading-relaxed">
              <span className="hidden sm:inline">
                UPI, Credit/Debit Cards, Net Banking, Wallets, and more!
              </span>
              <span className="sm:hidden">UPI, Cards, Net Banking & more!</span>
            </p>
          </div>
        </div>
      </div>

      {/* Test Mode Banner (only show in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 sm:mt-6 md:mt-8 bg-primary border border-primary rounded-lg p-3 sm:p-4 max-w-4xl mx-auto">
          <h3 className="font-semibold text-white mb-1.5 sm:mb-2 text-sm sm:text-base">
            🧪 Test Mode Active
          </h3>
          <p className="text-xs sm:text-sm text-primary-foreground leading-relaxed">
            <span className="hidden sm:inline">Use test card: </span>
            <span className="sm:hidden">Test card: </span>
            <code className="bg-white text-primary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium text-[10px] sm:text-xs">
              4111 1111 1111 1111
            </code>{" "}
            <span className="hidden sm:inline">or any UPI ID for testing</span>
            <span className="sm:hidden">or any UPI</span>
          </p>
        </div>
      )}
    </div>
  );
}
