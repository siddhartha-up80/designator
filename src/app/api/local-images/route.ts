import { NextResponse } from "next/server";
import { ImagePair } from "@/lib/image-service";

export async function GET() {
  try {
    // Define all available image pairs based on your folder structure
    const imagePairs: ImagePair[] = [
      {
        id: 1,
        modelImage: "model (1).jpg",
        productImage: "product (1).png",
        modelImagePath: "/images/model (1).jpg",
        productImagePath: "/images/product (1).png",
      },
      {
        id: 2,
        modelImage: "model (2).jpg",
        productImage: "product (2).png",
        modelImagePath: "/images/model (2).jpg",
        productImagePath: "/images/product (2).png",
      },
      {
        id: 3,
        modelImage: "model (3).jpg",
        productImage: "product (3).png",
        modelImagePath: "/images/model (3).jpg",
        productImagePath: "/images/product (3).png",
      },
      {
        id: 4,
        modelImage: "model (4).jpg",
        productImage: "product (4).png",
        modelImagePath: "/images/model (4).jpg",
        productImagePath: "/images/product (4).png",
      },
      {
        id: 5,
        modelImage: "model (5).jpg",
        productImage: "product (5).png",
        modelImagePath: "/images/model (5).jpg",
        productImagePath: "/images/product (5).png",
      },
      {
        id: 6,
        modelImage: "model (6).jpg",
        productImage: "product (6).png",
        modelImagePath: "/images/model (6).jpg",
        productImagePath: "/images/product (6).png",
      },
      {
        id: 7,
        modelImage: "model (7).jpg",
        productImage: "product (7).png",
        modelImagePath: "/images/model (7).jpg",
        productImagePath: "/images/product (7).png",
      },
    ];

    return NextResponse.json(imagePairs);
  } catch (error) {
    console.error("Error fetching local images:", error);

    // Return fallback data
    const fallbackPairs: ImagePair[] = [
      {
        id: 1,
        modelImage: "model (1).jpg",
        productImage: "product (1).png",
        modelImagePath: "/images/model (1).jpg",
        productImagePath: "/images/product (1).png",
      },
      {
        id: 2,
        modelImage: "model (2).jpg",
        productImage: "product (2).png",
        modelImagePath: "/images/model (2).jpg",
        productImagePath: "/images/product (2).png",
      },
    ];

    return NextResponse.json(fallbackPairs);
  }
}
