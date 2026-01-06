import { NextResponse } from "next/server";

import { createMessage, listMessages } from "../_lib/messages";
import { createMessageBodySchema } from "./schema";

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

  const parsed = createMessageBodySchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid body";
    return NextResponse.json({ error: first, issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const message = await createMessage(parsed.data);
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create message" },
      { status: 400 },
    );
  }
}
