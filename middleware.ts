import { NextRequest, NextResponse } from "next/server";

const CALC01_URL = process.env.CALC01_URL || "https://placeholder.workers.dev";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Extract subdomain: "calc01.ethanfa.com" → "calc01"
  // Works in prod (calc01.ethanfa.com) and local dev (calc01.localhost:3000)
  const hostParts = hostname.replace(":3000", "").split(".");
  const isSubdomain =
    (hostParts.length === 3 && hostParts[1] === "ethanfa") ||
    (hostParts.length === 2 && hostParts[1] === "localhost");

  if (!isSubdomain) return NextResponse.next();

  const subdomain = hostParts[0];

  switch (subdomain) {
    case "calc01":
      // Redirect to the live Cloudflare Workers deployment
      return NextResponse.redirect(CALC01_URL);

    case "rustplusplus":
      // Showcase page hosted within this app
      return NextResponse.rewrite(
        new URL("/project/rustplusplus", request.url)
      );

    case "emoji":
      // Showcase page
      return NextResponse.rewrite(
        new URL("/project/emoji-reactor", request.url)
      );

    case "signlingo":
      // Coming soon page
      return NextResponse.rewrite(
        new URL("/coming-soon/signlingo", request.url)
      );

    case "poop":
      // Coming soon page
      return NextResponse.rewrite(new URL("/coming-soon/poop", request.url));

    default:
      return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
