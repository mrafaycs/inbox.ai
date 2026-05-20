import fs from "fs";
import path from "path";
import { getOAuthClient } from "@/lib/google";

export async function refreshToken() {
  const tokenPath = path.join(process.cwd(), "token.json");

  if (!fs.existsSync(tokenPath)) {
    throw new Error("No token found. Please authenticate.");
  }

  const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials(tokens);

  try {
    const { token } = await oauth2Client.getAccessToken();
    const updatedCreds = oauth2Client.credentials;
    fs.writeFileSync(tokenPath, JSON.stringify(updatedCreds, null, 2));
  } catch (error) {
    
    console.error("Token refresh failed:", error);
    throw new Error("TokenExpired");
  }
}
