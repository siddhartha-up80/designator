import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing NODE_ENV:", process.env.NODE_ENV);

    const isDevelopment = process.env.NODE_ENV === "development";
    console.log("Is development:", isDevelopment);

    // Test the dev response helpers
    const { devResponseHelpers } = await import("@/lib/dev-responses");
    console.log(
      "Dev helpers loaded, isDevelopment:",
      devResponseHelpers.isDevelopment
    );

    if (devResponseHelpers.isDevelopment) {
      const fakeResponse =
        await devResponseHelpers.getFakeFashionTryOnResponse();
      console.log("Fake response generated successfully");

      return NextResponse.json({
        test: "success",
        environment: process.env.NODE_ENV,
        isDevelopment: devResponseHelpers.isDevelopment,
        fakeResponse,
      });
    } else {
      return NextResponse.json({
        test: "success",
        environment: process.env.NODE_ENV,
        isDevelopment: devResponseHelpers.isDevelopment,
        message: "Not in development mode",
      });
    }
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      {
        test: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
