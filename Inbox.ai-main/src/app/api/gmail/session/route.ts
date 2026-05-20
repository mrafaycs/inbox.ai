import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("gmail_token");
  return NextResponse.json({ connected: !!token });
}
