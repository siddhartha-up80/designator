import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo-config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = generateSEOMetadata({
  title: "FAQ - AI Fashion Model Generator | Designator Help Center",
  description:
    "Find answers to frequently asked questions about Designator AI fashion model generator, virtual try-on technology, and pricing.",
  keywords: [
    "AI fashion FAQ",
    "virtual try-on questions",
    "fashion AI help",
    "Designator FAQ",
    "AI model generator help",
    "fashion technology FAQ",
    "virtual fashion questions",
    "AI photography FAQ",
    "fashion AI support",
    "digital fashion help",
  ],
  canonical: "/faq",
});

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is Designator and how does it work?",
        answer:
          "Designator is a comprehensive AI-powered fashion and image generation platform. It offers multiple features including Product Model generation (creating models wearing your products), Prompt to Image generation, Image to Prompt conversion, AI Photography, and Fashion Try-On technology. Simply upload your images or provide text prompts to generate stunning visual content.",
      },
      {
        question: "Do I need any technical skills to use Designator?",
        answer:
          "No technical skills required! Designator is designed with an intuitive interface for everyone - from fashion designers and brands to content creators and marketers. Each feature has a user-friendly workflow that guides you through the process step by step.",
      },
      {
        question: "How do I access my generated images?",
        answer:
          "All your generated images are stored in the Gallery section where you can view, download, and manage your creations. You can access your gallery anytime from the main navigation to review your AI-generated content.",
      },
    ],
  },
  {
    category: "Core Features",
    questions: [
      {
        question: "What is Product Model generation?",
        answer:
          "Product Model is our flagship feature that creates realistic AI models wearing your fashion products. Upload your clothing or accessory images, and our AI generates professional model photos showcasing your items. Perfect for e-commerce, catalogs, and marketing materials.",
      },
      {
        question: "How does Prompt to Image work?",
        answer:
          "Prompt to Image allows you to create stunning visuals from text descriptions. Simply describe what you want to see - fashion scenes, product concepts, lifestyle images - and our AI generates high-quality images matching your vision. Great for creative brainstorming and concept development.",
      },
      {
        question: "What is Image to Prompt (Img to Prompt)?",
        answer:
          "This feature analyzes your uploaded images and generates detailed text descriptions or prompts. It's perfect for understanding how to describe images for AI generation, reverse-engineering successful prompts, or creating variations of existing images.",
      },
      {
        question: "What does the Photography feature offer?",
        answer:
          "Our Photography feature provides AI-powered photo enhancement and generation. It can improve image quality, create professional-looking product photography, and generate various photographic styles to enhance your visual content.",
      },
      {
        question: "How does Fashion Try-On work?",
        answer:
          "Fashion Try-On creates virtual fitting experiences by placing clothing items on different models or backgrounds. It's ideal for showing how garments look on various body types and helping customers visualize products before purchase.",
      },
    ],
  },
  {
    category: "Credits & Usage",
    questions: [
      {
        question: "How does the credit system work?",
        answer:
          "Each AI generation consumes credits based on complexity and resolution. Different features may use different amounts of credits. You can monitor your usage in the Statistics section and purchase more credits through the Credits page when needed.",
      },
      {
        question: "Where can I track my usage statistics?",
        answer:
          "The Statistics section provides detailed insights into your credit usage, generation history, and feature utilization. This helps you understand your usage patterns and plan your credit purchases accordingly.",
      },
      {
        question: "How do I buy more credits?",
        answer:
          "Visit the Credits section from the main navigation to view available credit packages and purchase options. We offer various packages to suit different usage needs, from occasional users to high-volume commercial applications.",
      },
    ],
  },
  {
    category: "Account Management",
    questions: [
      {
        question: "How do I manage my account settings?",
        answer:
          "Access the Settings page from the navigation menu to configure your account preferences, update profile information, manage notifications, and customize your Designator experience according to your needs.",
      },
      {
        question: "Is my data secure on Designator?",
        answer:
          "Yes, we prioritize your privacy and security. All uploaded images and generated content are processed securely. We use industry-standard encryption and security measures to protect your data and creative work.",
      },
      {
        question: "Can I use generated images commercially?",
        answer:
          "Yes! Images generated with paid credits come with commercial usage rights. You can use them for marketing, e-commerce, social media, print materials, and other business purposes. Please review our terms of service for complete details.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "What if my generation doesn't produce the expected results?",
        answer:
          "Try refining your prompts with more specific descriptions, use higher quality source images, or experiment with different settings. Each feature has tips and best practices available. If issues persist, contact our support team for assistance.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "Designator supports common image formats including JPG, PNG, and WebP for uploads. Generated images are typically provided in high-quality formats suitable for both web and print use.",
      },
      {
        question: "How can I get help if I'm stuck?",
        answer:
          "You can contact our support team through the contact options provided, check the documentation section, or experiment with the various features using the intuitive interfaces. Each feature is designed to be self-explanatory with helpful tooltips and guidance.",
      },
    ],
  },
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((category) =>
      category.questions.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about Designator AI fashion model
              generator
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                  {category.category}
                </h2>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, questionIndex) => (
                    <AccordionItem
                      key={questionIndex}
                      value={`${categoryIndex}-${questionIndex}`}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300 pt-2 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-semibold mb-4">
              Still have questions?
            </h3>
            <p className="mb-6 opacity-90">
              Our support team is here to help you get the most out of
              Designator
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:siddharthasingh.work@gmail.com"
                className="px-6 py-3 bg-white text-rose-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Email Support
              </a>
              <a
                href="/documentation"
                className="px-6 py-3 border border-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
