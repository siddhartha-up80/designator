"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Camera,
  Shirt,
  Video,
  ArrowUpRight,
  ImageIcon,
  Settings,
  CreditCard,
  Image as ImageIconLucide,
  File,
  Triangle,
  ChevronRight,
  Wand2,
  MessageSquare,
  FileImage,
} from "lucide-react";

const aiTools = [
  {
    id: "product-model",
    title: "Product Model Generation",
    description:
      "Generate professional product photos with AI models wearing your designs",
    icon: Sparkles,
    href: "/product-model",
    buttonText: "Generate",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
    outputLabels: ["Model", "Product"],
    previewImage: "/images/product1.png",
  },
  {
    id: "ai-photography",
    title: "AI Photography",
    description:
      "Enhance and transform your product photos with professional AI photography",
    icon: Camera,
    href: "/photography",
    buttonText: "Enhance",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    previewImage: "/images/product2.png",
  },
  {
    id: "fashion-try-on",
    title: "Fashion Try On",
    description:
      "Let customers virtually try on your garments using AI technology",
    icon: Shirt,
    href: "/fashion-try-on",
    buttonText: "Try On",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
    previewImage: "/images/model1.png",
    modelImages: ["/images/model1_2.png", "/images/model1_3.png"],
  },
  {
    id: "gallery",
    title: "Creative Gallery",
    description:
      "Browse and manage your AI-generated fashion models and creative content",
    icon: ImageIconLucide,
    href: "/gallery",
    buttonText: "Browse",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-500",
    previewImage: "/images/product3.png",
    isGallery: true,
  },
  {
    id: "prompt-to-image",
    title: "Prompt to Image",
    description:
      "Generate stunning fashion and product images from text descriptions",
    icon: Wand2,
    href: "/prompt-to-image",
    buttonText: "Generate",
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    previewImage: "/images/product5.png",
  },
  {
    id: "img-to-prompt",
    title: "Image to Prompt",
    description:
      "Extract detailed prompts and descriptions from your existing images",
    icon: MessageSquare,
    href: "/img-to-prompt",
    buttonText: "Analyze",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-500",
    previewImage: "/images/model7.png",
  },
];

const quickAccessItems = [
  {
    icon: ImageIconLucide,
    title: "Gallery",
    href: "/gallery",
  },
  {
    icon: CreditCard,
    title: "Pricing",
    href: "/pricing",
  },
  {
    icon: Settings,
    title: "Settings",
    href: "/settings",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Tools & Workflows
          </h1>
          <p className="text-xl text-gray-600">
            Choose your preferred workflow to get started
          </p>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {aiTools.map((tool, index) => {
            const gradientClasses = [
              "bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 border border-purple-200/30",
              "bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 border border-blue-200/30",
              "bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 border border-pink-200/30",
              "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 border border-indigo-200/30",
              "bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 border border-green-200/30",
              "bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 border border-cyan-200/30",
            ];

            const outputGradients = [
              "bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200",
              "bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-200",
              "bg-gradient-to-br from-pink-200 via-rose-200 to-red-200",
              "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200",
              "bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200",
              "bg-gradient-to-br from-cyan-200 via-blue-200 to-indigo-200",
            ];

            const buttonColors = [
              "text-purple-500 group-hover:text-purple-600",
              "text-blue-500 group-hover:text-blue-600",
              "text-pink-500 group-hover:text-pink-600",
              "text-indigo-500 group-hover:text-indigo-600",
              "text-green-500 group-hover:text-green-600",
              "text-cyan-500 group-hover:text-cyan-600",
            ];

            const IconComponent = tool.icon;

            return (
              <div
                key={tool.id}
                className={`${gradientClasses[index]} rounded-3xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
                onClick={() => router.push(tool.href)}
              >
                {/* Header with Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-sm">
                    <IconComponent className={`h-6 w-6 ${tool.iconColor}`} />
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {tool.description}
                </p>

                {/* Output Section */}
                <div
                  className={`${outputGradients[index]} rounded-2xl p-6 mb-4 relative`}
                >
                  <div className="absolute top-4 right-4 bg-white rounded-xl px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm">
                    Output
                  </div>

                  {/* Dynamic Content Based on Tool Type */}
                  {tool.id === "product-model" && (
                    <>
                      {/* Model and Product */}
                      <div className="flex justify-center gap-4 mt-8 mb-4">
                        <div className="w-16 h-24 bg-gradient-to-b from-pink-300 to-pink-500 rounded-2xl relative shadow-lg">
                          {/* Model figure */}
                          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-400 rounded-full"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-10 h-12 bg-pink-400 rounded-t-xl"></div>
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-pink-400 rounded-b-xl"></div>
                        </div>
                        <div className="w-16 h-20 bg-gradient-to-b from-amber-600 to-amber-800 rounded-2xl shadow-lg relative overflow-hidden">
                          <div className="absolute inset-2 bg-gradient-to-b from-amber-400 to-amber-600 rounded-xl"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/30 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-4">
                        <div className="bg-purple-500 text-white text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Model
                        </div>
                        <div className="bg-amber-500 text-white text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Product
                        </div>
                      </div>
                    </>
                  )}

                  {tool.id === "ai-photography" && (
                    <>
                      {/* Camera/Photo Enhancement */}
                      <div className="flex justify-center mt-8 mb-4">
                        <div className="w-20 h-16 bg-gradient-to-b from-gray-800 to-black rounded-2xl shadow-lg relative overflow-hidden">
                          <div className="absolute inset-2 bg-gradient-to-b from-gray-700 to-gray-900 rounded-xl"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <div className="w-1 h-3 bg-gray-600 rounded"></div>
                            <div className="w-3 h-1 bg-gray-600 absolute rounded"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-blue-500 text-white text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Enhanced
                        </div>
                      </div>
                    </>
                  )}

                  {tool.id === "fashion-try-on" && (
                    <>
                      {/* Model with clothing options */}
                      <div className="flex justify-center mt-8 mb-4">
                        <div className="w-16 h-24 bg-gradient-to-b from-pink-300 to-pink-500 rounded-2xl relative shadow-lg">
                          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-400 rounded-full"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-10 h-12 bg-pink-400 rounded-t-xl"></div>
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-pink-400 rounded-b-xl"></div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <div className="w-6 h-6 bg-red-400 rounded-lg shadow-sm"></div>
                        <div className="w-6 h-6 bg-blue-400 rounded-lg shadow-sm"></div>
                        <div className="w-6 h-6 bg-green-400 rounded-lg shadow-sm"></div>
                      </div>
                    </>
                  )}

                  {tool.id === "gallery" && (
                    <>
                      {/* Gallery grid preview */}
                      <div className="flex justify-center mt-8 mb-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="w-8 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-lg shadow-sm"></div>
                          <div className="w-8 h-10 bg-gradient-to-b from-pink-400 to-pink-600 rounded-lg shadow-sm"></div>
                          <div className="w-8 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-sm"></div>
                          <div className="w-8 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-lg shadow-sm"></div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-indigo-500 text-white text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Gallery
                        </div>
                      </div>
                    </>
                  )}

                  {tool.id === "prompt-to-image" && (
                    <>
                      {/* Text to image concept */}
                      <div className="flex justify-center items-center gap-3 mt-8 mb-4">
                        <div className="w-12 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-xs text-gray-600 font-mono">
                            ABC
                          </div>
                        </div>
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <ChevronRight className="h-2 w-2 text-white" />
                        </div>
                        <div className="w-12 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-lg"></div>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-green-500 text-white text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Generated
                        </div>
                      </div>
                    </>
                  )}

                  {tool.id === "img-to-prompt" && (
                    <>
                      {/* Image to text concept */}
                      <div className="flex justify-center items-center gap-3 mt-8 mb-4">
                        <div className="w-12 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-lg"></div>
                        <div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                          <ChevronRight className="h-2 w-2 text-white" />
                        </div>
                        <div className="w-12 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-xs text-gray-600 font-mono">
                            TXT
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-cyan-500 text-white text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Description
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Button */}
                <div
                  className={`flex items-center ${buttonColors[index]} font-semibold text-lg`}
                >
                  <span>{tool.buttonText}</span>
                  <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Recent Activity
              </h2>
              <Button
                variant="link"
                className="text-orange-500 font-medium p-0 hover:text-orange-600"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <div className="bg-gray-800 rounded-lg p-2">
                  <File className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-500 font-medium mb-2 text-lg">
                No recent activity
              </p>
              <p className="text-gray-400 text-sm">
                Start creating to see your work here
              </p>
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Quick Access
            </h2>

            <div className="space-y-4">
              {quickAccessItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 hover:bg-gray-50 rounded-2xl"
                  onClick={() => router.push(item.href)}
                >
                  <div className="bg-gray-100 rounded-xl p-3 mr-4">
                    <item.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-lg">
                    {item.title}
                  </span>
                </Button>
              ))}
            </div>

            {/* Low Credit Alert */}
            <div className="mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 rounded-xl p-2.5">
                  <Triangle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 mb-2 text-lg">
                    Low Credit Alert
                  </h3>
                  <p className="text-sm text-orange-700 mb-4 leading-relaxed">
                    You have 50 credits remaining. Consider upgrading to
                    continue creating.
                  </p>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-6 py-2.5 h-auto rounded-xl font-medium"
                    onClick={() => router.push("/pricing")}
                  >
                    Upgrade Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
