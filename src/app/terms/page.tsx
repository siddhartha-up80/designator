import { Metadata } from "next";
import { FileText, Scale, Shield, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using Designator's AI fashion model generation platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto py-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Terms & Conditions
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
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              By accessing and using Designator, you agree to be bound by these
              Terms and Conditions. Please read them carefully before using our
              services.
            </AlertDescription>
          </Alert>

          {/* Introduction */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Welcome to Designator ("we," "our," or "us"). These Terms and
                Conditions govern your use of our AI fashion model generation
                platform and services available at
                designator.siddharthasingh.co.in.
              </p>
              <p>
                By creating an account or using our services, you acknowledge
                that you have read, understood, and agree to be bound by these
                terms.
              </p>
            </CardContent>
          </Card>

          {/* Services Description */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                2. Services Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Designator provides the following AI-powered services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Fashion Try-On:</strong> Generate AI models wearing
                  your clothing products
                </li>
                <li>
                  <strong>Product Model Generation:</strong> Create professional
                  product photography with AI models
                </li>
                <li>
                  <strong>Photography Enhancement:</strong> Enhance and improve
                  existing fashion photography
                </li>
                <li>
                  <strong>Prompt to Image:</strong> Generate fashion images from
                  text descriptions
                </li>
                <li>
                  <strong>Image to Prompt:</strong> Extract detailed
                  descriptions from fashion images
                </li>
              </ul>
              <p>
                All services are provided on a credit-based system where users
                purchase credits to access features.
              </p>
            </CardContent>
          </Card>

          {/* Pricing and Payments */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                3. Pricing and Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3.1 Credit Packages
                </h3>
                <p>
                  We offer the following credit packages (all prices in INR):
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>
                    <strong>Starter Pack:</strong> 100 credits for ₹99
                  </li>
                  <li>
                    <strong>Popular Pack:</strong> 500 credits + 50 bonus (550
                    total) for ₹449
                  </li>
                  <li>
                    <strong>Pro Pack:</strong> 1000 credits + 150 bonus (1150
                    total) for ₹849
                  </li>
                  <li>
                    <strong>Mega Pack:</strong> 2500 credits + 500 bonus (3000
                    total) for ₹1999
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3.2 Credit Usage
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fashion Try-On: 25 credits per generation</li>
                  <li>Prompt to Image: 10 credits per image</li>
                  <li>Photography Enhancement: 15 credits per enhancement</li>
                  <li>Image to Prompt: 5 credits per analysis</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3.3 Payment Methods
                </h3>
                <p>
                  We accept payments through Cashfree Payment Gateway, including
                  credit/debit cards, UPI, net banking, and digital wallets. All
                  transactions are processed securely.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3.4 Non-Expiring Credits
                </h3>
                <p>
                  Purchased credits do not expire and remain in your account
                  until used.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3.5 No Refund Policy
                </h3>
                <p>
                  <strong className="text-foreground">
                    All credit purchases are final and non-refundable.
                  </strong>{" "}
                  Once payment is processed and credits are added to your
                  account, we do not offer monetary refunds under any
                  circumstances. In case of technical issues such as payment
                  failures, API unavailability, or internal system errors, we
                  will restore credits to your account but will not issue
                  monetary refunds. Please review our Refunds & Cancellations
                  policy for complete details.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">4. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  4.1 Account Creation
                </h3>
                <p>
                  You must create an account to use our services. You agree to
                  provide accurate and complete information during registration.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  4.2 Account Security
                </h3>
                <p>
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities under your
                  account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  4.3 Account Termination
                </h3>
                <p>
                  We reserve the right to suspend or terminate accounts that
                  violate these terms or engage in fraudulent activities.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">5. Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You agree NOT to use our services to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Generate content that is illegal, harmful, threatening,
                  abusive, or obscene
                </li>
                <li>Infringe upon intellectual property rights of others</li>
                <li>
                  Upload images containing inappropriate or offensive content
                </li>
                <li>Attempt to manipulate or abuse the credit system</li>
                <li>Reverse engineer, decompile, or hack our platform</li>
                <li>
                  Use automated systems to access the service without permission
                </li>
                <li>
                  Resell or redistribute generated content without proper
                  licensing
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                6. Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  6.1 User Content
                </h3>
                <p>
                  You retain ownership of images you upload. By uploading, you
                  grant us a license to process and generate content based on
                  your inputs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  6.2 Generated Content
                </h3>
                <p>
                  You own the commercial rights to content generated using our
                  services, subject to these terms and applicable laws.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  6.3 Platform Rights
                </h3>
                <p>
                  All rights, title, and interest in the Designator platform,
                  including software, algorithms, and branding, remain our
                  exclusive property.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Warranties and Disclaimers */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                7. Warranties and Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our services are provided "as is" without warranties of any
                kind. We do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Uninterrupted or error-free service</li>
                <li>Specific quality or accuracy of AI-generated content</li>
                <li>Compatibility with all devices or browsers</li>
                <li>
                  That generated content will meet your specific requirements
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                8. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                To the maximum extent permitted by law, Designator shall not be
                liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>
                  Damages exceeding the amount paid by you in the last 12 months
                </li>
                <li>
                  Issues arising from third-party services or integrations
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">9. Privacy and Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Your use of our services is also governed by our Privacy Policy.
                We collect, use, and protect your data in accordance with
                applicable laws.
              </p>
              <p>
                Images uploaded are processed for generation purposes and may be
                stored temporarily. We do not sell your data to third parties.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Continued use of our
                services after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">11. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                These terms shall be governed by and construed in accordance
                with the laws of India. Any disputes shall be subject to the
                exclusive jurisdiction of courts in India.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-2xl">12. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                For questions about these Terms and Conditions, please contact
                us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong className="text-foreground">Email:</strong>{" "}
                  siddharthasingh.work@gmail.com
                </p>
                <p>
                  <strong className="text-foreground">Website:</strong>{" "}
                  designator.siddharthasingh.co.in
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
