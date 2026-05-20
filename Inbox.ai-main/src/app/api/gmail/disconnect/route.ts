import { getOAuthClient } from "@/lib/google";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const oauth2Client = getOAuthClient();
  const tokenPath = path.join(process.cwd(), "token.json");

  if (fs.existsSync(tokenPath)) {
    const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
    oauth2Client.setCredentials(tokens);

    if (tokens.access_token) {
      await oauth2Client.revokeToken(tokens.access_token);
    }
    fs.unlinkSync(tokenPath);
  }

  const response = NextResponse.json({
    message: "User disconnected and tokens revoked",
  });

  response.cookies.set("gmail_token", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
