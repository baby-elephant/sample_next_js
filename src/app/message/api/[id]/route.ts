import { NextResponse } from "next/server";

import { deleteMessage, getMessageById, updateMessage } from "../../_lib/messages";
import { messageIdSchema, updateMessageBodySchema } from "../schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badRequest(message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status: 400 });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await context.params;
  const parsedId = messageIdSchema.safeParse(rawId);
  if (!parsedId.success) return badRequest(parsedId.error.issues[0]?.message ?? "Invalid id");

  const message = await getMessageById(parsedId.data);
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ message });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const parsedId = messageIdSchema.safeParse(rawId);
  if (!parsedId.success) return badRequest(parsedId.error.issues[0]?.message ?? "Invalid id");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const parsedBody = updateMessageBodySchema.safeParse(body);
  if (!parsedBody.success) {
    const first = parsedBody.error.issues[0]?.message ?? "Invalid body";
    return badRequest(first, { issues: parsedBody.error.issues });
  }

  const message = await updateMessage(parsedId.data, parsedBody.data);
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ message });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await context.params;
  const parsedId = messageIdSchema.safeParse(rawId);
  if (!parsedId.success) return badRequest(parsedId.error.issues[0]?.message ?? "Invalid id");

  const ok = await deleteMessage(parsedId.data);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

