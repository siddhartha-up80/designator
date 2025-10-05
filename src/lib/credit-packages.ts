// Credit packages configuration for payment system

export const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 100,
    price: 99, // ₹99
    popular: false,
    bonus: 0,
    description: "Perfect for trying out features",
    features: [
      "4 Photo Generations",
      "10 Text Prompts",
      "6 Photo Enhancements",
    ],
  },
  {
    id: "popular",
    name: "Popular Pack",
    credits: 500,
    price: 449, // ₹449 (10% bonus)
    popular: true,
    bonus: 50,
    description: "Most popular choice",
    features: [
      "20 Photo Generations",
      "50 Text Prompts",
      "33 Photo Enhancements",
      "10% Bonus Credits",
    ],
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 1000,
    price: 849, // ₹849 (15% bonus)
    popular: false,
    bonus: 150,
    description: "For power users",
    features: [
      "40 Photo Generations",
      "100 Text Prompts",
      "66 Photo Enhancements",
      "15% Bonus Credits",
    ],
  },
  {
    id: "mega",
    name: "Mega Pack",
    credits: 2500,
    price: 1999, // ₹1999 (20% bonus)
    popular: false,
    bonus: 500,
    description: "Best value for businesses",
    features: [
      "100 Photo Generations",
      "250 Text Prompts",
      "166 Photo Enhancements",
      "20% Bonus Credits",
    ],
  },
] as const;

export type CreditPackage = (typeof CREDIT_PACKAGES)[number];

export function getCreditPackage(packageId: string): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((pkg) => pkg.id === packageId);
}

export function calculateTotalCredits(packageId: string): number {
  const pkg = getCreditPackage(packageId);
  if (!pkg) return 0;
  return pkg.credits + pkg.bonus;
}
