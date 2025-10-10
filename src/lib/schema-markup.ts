// Schema markup utilities for enhanced SEO

export interface FAQSchema {
  question: string;
  answer: string;
}

export interface ReviewSchema {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}

export interface ProductSchema {
  name: string;
  description: string;
  image: string;
  brand: string;
  category: string;
  offers?: {
    price: number;
    currency: string;
    availability: string;
  };
}

export function generateFAQSchema(faqs: FAQSchema[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateProductSchema(product: ProductSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    ...(product.offers && {
      offers: {
        "@type": "Offer",
        price: product.offers.price,
        priceCurrency: product.offers.currency,
        availability: product.offers.availability,
      },
    }),
  };
}

export function generateReviewSchema(reviews: ReviewSchema[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue:
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
  };
}

export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Designator",
    description:
      "AI-powered fashion model generator and virtual try-on technology",
    url: "https://designator.siddharthasingh.co.in",
    logo: "https://designator.siddharthasingh.co.in/dlogo.png",
    foundingDate: "2023",
    industry: "Fashion Technology",
    sameAs: [
      "https://twitter.com/designator_ai",
      "https://linkedin.com/company/designator-ai",
      "https://instagram.com/designator_ai",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "siddharthasingh.work@gmail.com",
      availableLanguage: "English",
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Designator",
    alternateName: "Designator AI Fashion Model Generator",
    description:
      "Create stunning AI fashion models and virtual try-on experiences",
    url: "https://designator.siddharthasingh.co.in",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://designator.siddharthasingh.co.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Designator",
      logo: {
        "@type": "ImageObject",
        url: "https://designator.siddharthasingh.co.in/dlogo.png",
      },
    },
  };
}

// Utility to safely stringify and inject JSON-LD
export function injectJsonLd(data: any) {
  return {
    __html: JSON.stringify(data, null, 0),
  };
}
