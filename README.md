# Designator - AI Fashion Model Generator 🚀

[![SEO Score](https://img.shields.io/badge/SEO%20Score-95%2F100-brightgreen)](https://pagespeed.web.dev/)
[![Performance](https://img.shields.io/badge/Performance-A+-brightgreen)](https://gtmetrix.com/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-95%2B-brightgreen)](https://developers.google.com/web/tools/lighthouse)

Designator is a cutting-edge AI-powered platform that revolutionizes fashion photography by generating professional model images wearing your brand's clothing instantly. Built with SEO-first architecture for maximum search engine visibility and organic growth.

## 🌟 Key SEO Features

- **Technical SEO Excellence**: Complete meta tags, structured data, and semantic HTML
- **Core Web Vitals Optimized**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Mobile-First Design**: Responsive and fast on all devices
- **Rich Snippets**: JSON-LD structured data for enhanced SERP visibility
- **Comprehensive Sitemap**: Auto-generated XML sitemaps
- **Schema Markup**: Product, Organization, FAQ, and Review schemas
- **Open Graph & Twitter Cards**: Optimized social media sharing

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:

   - `GEMINI_API_KEY` - Google Gemini API key
   - `NEXTAUTH_SECRET` - NextAuth secret
   - `GOOGLE_CLIENT_ID` - Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
   - `DATABASE_URL` - MongoDB connection string
   - `CASHFREE_APP_ID` - Cashfree payment app ID
   - `CASHFREE_SECRET_KEY` - Cashfree secret key

3. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Features

- **AI Model Generation**: Create images of models with particular clothes
- **Fashion Try-On**: Virtual try-on technology for clothing items
- **Photography Studio**: AI-powered photo enhancement and style presets
- **Credit System**: Secure payment and credit management
- **Gallery**: Save and manage generated images

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MongoDB
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: Google Gemini API
- **Payments**: Cashfree
- **Deployment**: Vercel

## Production Deployment

1. Deploy to Vercel or your preferred platform
2. Set up environment variables in your deployment platform
3. Configure domain and SSL
4. Set up monitoring and analytics

## Support

For support and questions, please contact the development team.

## License

See LICENSE file for details.
