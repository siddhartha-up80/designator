"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Check,
  Star,
  Zap,
  Crown,
  Sparkles,
  Users,
  Shield,
  Headphones,
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "month",
    description: "Perfect for trying out our AI fashion tools",
    features: [
      "5 model generations per month",
      "Basic image upscaling (2x)",
      "Standard image quality",
      "Community support",
      "Watermarked outputs",
    ],
    limitations: [
      "Limited to 512x512 output",
      "No commercial use",
      "Basic templates only",
    ],
    popular: false,
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "month",
    description: "For fashion designers and content creators",
    features: [
      "100 model generations per month",
      "Advanced upscaling (up to 8x)",
      "High-quality outputs",
      "Priority processing",
      "No watermarks",
      "Commercial license",
      "Advanced templates",
      "Email support",
      "HD video generation (10s)",
    ],
    limitations: [],
    popular: true,
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "month",
    description: "For teams and businesses with high-volume needs",
    features: [
      "Unlimited model generations",
      "Maximum upscaling (16x)",
      "Ultra-high quality",
      "Instant processing",
      "White-label options",
      "API access",
      "Custom training",
      "Dedicated support",
      "Advanced analytics",
      "Team collaboration",
      "Extended video generation (60s)",
      "Custom integrations",
    ],
    limitations: [],
    popular: false,
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
  },
];

const features = [
  {
    name: "AI Model Generation",
    free: "5/month",
    pro: "100/month",
    enterprise: "Unlimited",
  },
  {
    name: "Image Upscaling",
    free: "2x",
    pro: "8x",
    enterprise: "16x",
  },
  {
    name: "Video Generation",
    free: "❌",
    pro: "10s HD",
    enterprise: "60s 4K",
  },
  {
    name: "Commercial License",
    free: "❌",
    pro: "✅",
    enterprise: "✅",
  },
  {
    name: "API Access",
    free: "❌",
    pro: "❌",
    enterprise: "✅",
  },
  {
    name: "Priority Support",
    free: "❌",
    pro: "✅",
    enterprise: "Dedicated",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const getPrice = (basePrice: string, cycle: "monthly" | "yearly") => {
    if (basePrice === "$0") return "$0";
    const numPrice = parseInt(basePrice.replace("$", ""));
    if (cycle === "yearly") {
      const yearlyPrice = Math.floor(numPrice * 12 * 0.8); // 20% discount
      return `$${yearlyPrice}`;
    }
    return basePrice;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <DollarSign className="h-10 w-10 text-primary" />
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Transform your fashion business with AI-powered tools. Start free
            and scale as you grow.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span
            className={
              billingCycle === "monthly"
                ? "font-semibold"
                : "text-muted-foreground"
            }
          >
            Monthly
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className="relative"
          >
            <div
              className={`w-12 h-6 rounded-full transition-colors ${
                billingCycle === "yearly" ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 ${
                  billingCycle === "yearly"
                    ? "translate-x-6"
                    : "translate-x-0.5"
                }`}
              />
            </div>
          </Button>
          <span
            className={
              billingCycle === "yearly"
                ? "font-semibold"
                : "text-muted-foreground"
            }
          >
            Yearly
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "ring-2 ring-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="px-3 py-1 bg-primary text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  {plan.id === "free" && (
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  )}
                  {plan.id === "pro" && (
                    <Zap className="h-8 w-8 text-primary" />
                  )}
                  {plan.id === "enterprise" && (
                    <Crown className="h-8 w-8 text-yellow-500" />
                  )}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">
                    {getPrice(plan.price, billingCycle)}
                    <span className="text-lg text-muted-foreground font-normal">
                      /{billingCycle === "yearly" ? "year" : plan.period}
                    </span>
                  </div>
                  {billingCycle === "yearly" && plan.price !== "$0" && (
                    <div className="text-sm text-muted-foreground">
                      Billed annually
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.popular ? "bg-primary hover:bg-primary/90" : ""
                  }`}
                >
                  {plan.buttonText}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">What's included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Limitations:
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-orange-500 mt-0.5">⚠</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Feature</th>
                    <th className="text-center p-4">Free</th>
                    <th className="text-center p-4">Pro</th>
                    <th className="text-center p-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4 font-medium">{feature.name}</td>
                      <td className="p-4 text-center">{feature.free}</td>
                      <td className="p-4 text-center">{feature.pro}</td>
                      <td className="p-4 text-center">{feature.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Can I change plans anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes take effect immediately.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Do you offer refunds?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day money-back guarantee for all paid plans, no
                  questions asked.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">
                  What payment methods do you accept?
                </h4>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers
                  for enterprise plans.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Is there a free trial?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! Pro plan includes a 7-day free trial. Enterprise
                  customers get a 14-day trial.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Community Support</h3>
              <p className="text-sm text-muted-foreground">
                Join our active community forum for tips, tricks, and peer
                support.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Headphones className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground">
                Get help from our support team within 24 hours for Pro and
                Enterprise users.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Enterprise Support</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated account manager and priority support for Enterprise
                customers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
