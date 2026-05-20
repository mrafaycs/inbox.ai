import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

let oauthClient: OAuth2Client | null = null;

export function getOAuthClient(): OAuth2Client {
  if (!oauthClient) {
    oauthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
  
  }
  return oauthClient;
}
export function getAuthUrl() {
  const oauth2Client = getOAuthClient();
  const SCOPES = ['https://mail.google.com/'];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

