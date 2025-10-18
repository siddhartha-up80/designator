import { Metadata } from "next";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refunds & Cancellations",
  description:
    "Refund and cancellation policy for Designator's credit packages and services.",
};

export default function RefundsPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gradient-to-b from-background to-muted/20">
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Refunds & Cancellations
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Last updated: October 18, 2025
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 md:py-16">
        <div className="mx-auto max-w-4xl space-y-8">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription>
              All credit purchases are final and non-refundable. We only restore
              credits to your account in case of technical issues or payment
              errors. Please review our policy carefully before making a
              purchase.
            </AlertDescription>
          </Alert>

          {/* Overview */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">No Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                At Designator,{" "}
                <strong className="text-foreground">
                  all credit purchases are final and non-refundable
                </strong>
                . Once a payment is successfully processed and credits are added
                to your account, we do not offer monetary refunds under any
                circumstances.
              </p>
              <p>
                However, we understand that technical issues can occur. In such
                cases, we will restore credits to your account rather than
                issuing monetary refunds. Please read this policy carefully
                before making a purchase.
              </p>
            </CardContent>
          </Card>

          {/* Credit Restoration Cases */}
          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-2xl">
                  Credit Restoration Cases
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                We will restore credits to your account (not monetary refunds)
                in the following situations:
              </p>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    1. Payment Failed But Credits Not Added
                  </h3>
                  <p>
                    If your payment was processed but credits were not added to
                    your account due to a technical error, we will investigate
                    and add the credits to your account within 24-48 hours.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    2. API Service Unavailable
                  </h3>
                  <p>
                    If our AI generation APIs are unavailable or fail to deliver
                    results due to internal technical issues, the credits used
                    for that failed generation will be restored to your account.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    3. Platform Technical Errors
                  </h3>
                  <p>
                    If you experience technical issues on our platform that
                    consume credits without delivering the service (server
                    errors, timeouts, bugs), we will restore those credits after
                    verification.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    4. Duplicate Charges
                  </h3>
                  <p>
                    If you were charged multiple times for the same transaction
                    due to a payment gateway error, we will investigate and for
                    duplicate charges:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Remove duplicate credits from your account</li>
                    <li>
                      Initiate a refund for the duplicate charge through the
                      payment gateway
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* No Refunds */}
          <Card className="border-2 border-red-200 dark:border-red-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-2xl">No Monetary Refunds</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-medium text-foreground mb-4">
                We do NOT offer monetary refunds for the following situations:
              </p>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    1. All Credit Purchases
                  </h3>
                  <p>
                    All credit packages are final and non-refundable once
                    payment is processed. This applies to both used and unused
                    credits, regardless of the time since purchase.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    2. User Dissatisfaction with Results
                  </h3>
                  <p>No refunds or credit restoration for:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      Subjective dissatisfaction with AI-generated results
                    </li>
                    <li>Images not meeting your personal expectations</li>
                    <li>Quality concerns (AI results can vary)</li>
                    <li>Style or aesthetic preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    3. User Error
                  </h3>
                  <p>No refunds for:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Selecting wrong service or feature</li>
                    <li>Uploading incorrect or poor-quality images</li>
                    <li>Change of mind after using credits</li>
                    <li>Purchasing wrong credit package</li>
                    <li>Typing incorrect prompts or descriptions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    4. Promotional or Bonus Credits
                  </h3>
                  <p>
                    Bonus credits provided as part of promotional offers have no
                    monetary value and cannot be refunded or converted to cash.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    5. Account Issues
                  </h3>
                  <p>
                    No refunds will be issued if your account is suspended or
                    terminated due to violation of our Terms and Conditions,
                    abuse of service, or fraudulent activity.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    6. Change of Mind
                  </h3>
                  <p>
                    Once payment is processed, we do not accept requests for
                    refunds due to change of mind, even if credits are unused.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Restoration Request Process */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                Credit Restoration Request Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    How to Request Credit Restoration
                  </h3>
                  <p className="mb-2">
                    If you experienced a technical issue that qualifies for
                    credit restoration:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Contact our support team at support@designator.app</li>
                    <li>
                      Include your account email and transaction ID (if
                      applicable)
                    </li>
                    <li>Describe the technical issue you encountered</li>
                    <li>
                      Provide relevant screenshots, error messages, or
                      timestamps
                    </li>
                    <li>
                      Our team will investigate and respond within 24-48 hours
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Processing Time
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 mt-2">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">
                          Investigation Period
                        </span>
                      </div>
                      <p className="text-sm">24-48 hours</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">
                          Credit Restoration
                        </span>
                      </div>
                      <p className="text-sm">Immediate upon approval</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Verification Required
                  </h3>
                  <p>
                    All credit restoration requests will be verified through our
                    system logs. We can only restore credits if we confirm the
                    technical issue occurred on our end. False claims may result
                    in account suspension.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Payment Cancellation
                </h3>
                <p>
                  You may cancel a payment transaction before it is completed on
                  the payment gateway. Once a payment is processed and credits
                  are added to your account, the transaction cannot be cancelled
                  and is non-refundable.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Account Cancellation
                </h3>
                <p>
                  You may close your account at any time. However, remaining
                  credits in your account have no monetary value and cannot be
                  refunded upon account closure. We strongly recommend using all
                  credits before closing your account.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Service Cancellation
                </h3>
                <p>
                  Individual generation requests cannot be cancelled once
                  submitted as AI processing begins immediately. Credits are
                  deducted at the time of submission and cannot be restored
                  unless there is a verified technical failure.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Important Reminders */}
          <Card className="border-2 border-amber-200 dark:border-amber-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-2xl">Important Reminders</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">
                    All sales are final:
                  </strong>{" "}
                  Once payment is processed, we do not offer monetary refunds
                  under any circumstances.
                </li>
                <li>
                  <strong className="text-foreground">Credits only:</strong>{" "}
                  Technical issues result in credit restoration to your account,
                  not money back.
                </li>
                <li>
                  <strong className="text-foreground">
                    Test before buying:
                  </strong>{" "}
                  Try our services with smaller packages first to ensure they
                  meet your needs.
                </li>
                <li>
                  <strong className="text-foreground">Quality varies:</strong>{" "}
                  AI-generated results depend on input quality and prompts.
                  Results may vary.
                </li>
                <li>
                  <strong className="text-foreground">Read terms:</strong> By
                  purchasing credits, you agree to this no-refund policy.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Dispute Resolution */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you disagree with our decision on a credit restoration
                request, you may:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  Request a review by escalating to our senior support team
                </li>
                <li>
                  Provide additional information or documentation to support
                  your case
                </li>
                <li>
                  Contact your payment provider to initiate a chargeback (as a
                  last resort)
                </li>
              </ol>
              <Alert className="mt-4">
                <AlertDescription>
                  Note: Initiating a chargeback may result in account suspension
                  while the dispute is investigated.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-2 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">
                Questions About This Policy?
              </CardTitle>
              <CardDescription className="text-base">
                Our support team is here to help with technical issues and
                credit restoration requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Email:</strong>{" "}
                  siddharthasingh.work@gmail.com
                </p>
                <p>
                  <strong className="text-foreground">Response Time:</strong>{" "}
                  Within 24-48 hours
                </p>
              </div>
              <Button asChild size="lg" className="mt-4">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Policy Changes */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Policy Changes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify this refund and cancellation
                policy at any time. Changes will be effective immediately upon
                posting on our website. Your continued use of our services after
                changes constitutes acceptance of the updated policy.
              </p>
              <p>
                For refund requests related to purchases made before policy
                changes, the policy in effect at the time of purchase will
                apply.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
