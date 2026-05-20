import { getOAuthClient } from "@/lib/google";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new NextResponse("No code provided", { status: 400 });
  }

  const oauth2Client = getOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const tokenPath = path.join(process.cwd(), "token.json");
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.set("gmail_token", "connected", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true, 
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
