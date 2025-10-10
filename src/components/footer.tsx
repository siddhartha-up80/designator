"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { sidebarItems } from "@/components/sidebar-main";
import { Globe, Linkedin, Github, Instagram } from "lucide-react";

export default function Footer() {
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  // Derive services from the sidebar items to keep lists in sync.
  const services = sidebarItems.filter(
    (it) =>
      ![
        "/home",
        "/statistics",
        "/buy-credits",
        "/settings",
        "/gallery",
      ].includes(it.href)
  );

  useEffect(() => {
    let mounted = true;

    async function fetchBg() {
      try {
        const res = await fetch("/api/footer-image");
        const data = await res.json();
        if (mounted && data?.url) setBgUrl(data.url);
      } catch (err) {
        console.warn("Failed to load footer background image", err);
      }
    }

    fetchBg();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="relative text-white">
      {/* Background image as an img element to avoid inline styles */}
      <img
        aria-hidden
        src={bgUrl ?? "/designator.png"}
        alt=""
        className="absolute inset-0 w-full h-full object-cover filter blur-sm opacity-60"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="gap-8 flex flex-col md:flex-row justify-between">
          {/* Company Info */}
          <div className="space-y-6 max-w-sm ">
            <div className="flex items-center gap-2 -ml-1">
              <img
                src="/designator.png"
                alt="Designator"
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">
              Designator helps brands and individuals to create stunning model
              images with their own products and clothing. AI-powered, fast, and
              studio-free.
            </p>

            <div className="space-y-2 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <span>✉</span>
                <a
                  href="mailto:siddharthasingh.work@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  siddharthasingh.work@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Services</h4>
            <ul className="space-y-3 text-sm text-gray-200">
              {services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-300">
              © 2025 Designator. All rights reserved.
            </div>

            <div className="flex gap-6">
              <Link
                href="https://www.siddharthasingh.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800/60 rounded-full flex items-center justify-center hover:bg-gray-700"
                aria-label="Personal website"
                title="siddharthasingh.co.in"
              >
                <Globe className="w-4 h-4 text-gray-100" />
              </Link>

              <Link
                href="https://www.linkedin.com/in/siddhartha-singh-work"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800/60 rounded-full flex items-center justify-center hover:bg-gray-700"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-gray-100" />
              </Link>

              <Link
                href="https://github.com/siddhartha-up80"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800/60 rounded-full flex items-center justify-center hover:bg-gray-700"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github className="w-4 h-4 text-gray-100" />
              </Link>

              <Link
                href="https://www.instagram.com/sid_up80"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800/60 rounded-full flex items-center justify-center hover:bg-gray-700"
                aria-label="Instagram"
                title="Instagram: @sid_up80"
              >
                <Instagram className="w-4 h-4 text-gray-100" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
