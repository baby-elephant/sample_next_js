import { NextResponse } from "next/server";

import { createMessage, listMessages } from "../_lib/messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const messages = await listMessages();
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const subject = typeof record.subject === "string" ? record.subject : "";
  const bodyText = typeof record.body === "string" ? record.body : "";

  try {
    const message = await createMessage({ subject, body: bodyText });
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create message" },
      { status: 400 },
    );
  }
}
