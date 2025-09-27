import { NextRequest, NextResponse } from "next/server";
import { devResponseHelpers } from "@/lib/dev-responses";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testType = searchParams.get("type") || "model";

  if (!devResponseHelpers.isDevelopment) {
    return NextResponse.json({
      message: "Development mode test only",
      isDevelopment: false,
      nodeEnv: process.env.NODE_ENV,
    });
  }

  let response;

  switch (testType) {
    case "model":
      response = await devResponseHelpers.getFakeModelGenerationResponse(2);
      break;
    case "tryon":
      response = await devResponseHelpers.getFakeFashionTryOnResponse();
      break;
    case "prompt":
      response = await devResponseHelpers.getFakePromptToImageResponse(1);
      break;
    case "img2prompt":
      response = devResponseHelpers.getFakeImageToPromptResponse(3);
      break;
    case "enhance":
      response = await devResponseHelpers.getFakePhotographyEnhanceResponse();
      break;
    case "preset":
      response = await devResponseHelpers.getFakePhotographyPresetsResponse();
      break;
    default:
      response = {
        message:
          "Available types: model, tryon, prompt, img2prompt, enhance, preset",
      };
  }

  return NextResponse.json({
    isDevelopment: true,
    nodeEnv: process.env.NODE_ENV,
    testType,
    response,
  });
}
