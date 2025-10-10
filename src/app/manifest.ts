import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Designator - AI Fashion Model Generator",
    short_name: "Designator",
    description:
      "Generate stunning AI fashion models wearing your product designs with advanced virtual try-on technology",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f43f5e",
    icons: [
      {
        src: "/designator.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/dlogo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["lifestyle", "photo", "productivity"],
  };
}
