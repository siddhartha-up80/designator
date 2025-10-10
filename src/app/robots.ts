import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/private/",
          "/admin/",
          "/_next/",
          "/signin",
          "/signup",
        ],
      },
    ],
    sitemap: "https://designator.siddharthasingh.co.in/sitemap.xml", // Replace with your actual domain
  };
}
