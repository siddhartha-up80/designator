/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://designator.siddharthasingh.co.in",
  generateRobotsTxt: true, // (optional)
  generateIndexSitemap: false, // (optional) - for large sites

  // Exclude specific paths
  exclude: [
    "/api/*",
    "/admin/*",
    "/private/*",
    "/signin",
    "/signup",
    "/server-sitemap-index.xml",
    "/about",
    "/blog",
    "/upscale",
    "/video",
  ],

  // Custom robots.txt rules
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/", "/signin", "/signup"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
      },
    ],
    additionalSitemaps: [
      "https://designator.siddharthasingh.co.in/server-sitemap-index.xml",
    ],
  },

  // Additional options
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,

  // Transform function to customize sitemap entries
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      "/": { priority: 1.0, changefreq: "daily" },
      "/fashion-try-on": { priority: 0.9, changefreq: "weekly" },
      "/product-model": { priority: 0.9, changefreq: "weekly" },
      "/prompt-to-image": { priority: 0.8, changefreq: "weekly" },
      "/photography": { priority: 0.8, changefreq: "weekly" },
      "/gallery": { priority: 0.6, changefreq: "weekly" },
      "/faq": { priority: 0.6, changefreq: "monthly" },
    };

    const pathConfig = customConfig[path] || {};

    return {
      loc: path,
      changefreq: pathConfig.changefreq || config.changefreq,
      priority: pathConfig.priority || config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },

  // Add hreflang for international SEO (if needed in future)
  // alternateRefs: [
  //   {
  //     href: 'https://designator.siddharthasingh.co.in/en',
  //     hreflang: 'en',
  //   },
  //   {
  //     href: 'https://designator.siddharthasingh.co.in/es',
  //     hreflang: 'es',
  //   },
  // ],
};
