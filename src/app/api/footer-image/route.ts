import { pexelsService } from "@/lib/pexels-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Try to fetch a small curated set and pick one at random
    const images = await pexelsService.getCuratedImages(8, 1);

    if (!images || images.length === 0) {
      // Fallback to a local image in the public folder
      return NextResponse.json({ url: "/images/model (1).jpg" });
    }

    const img = images[Math.floor(Math.random() * images.length)];
    const url = pexelsService.getBestQualityUrl(img);

    return NextResponse.json({ url });
  } catch (err) {
    console.warn("Failed to fetch footer image from Pexels:", err);
    return NextResponse.json({ url: "/images/model (1).jpg" });
  }
}
