import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Message = {
  id: string;
  subject: string;
  body: string;
};

export type CreateMessageInput = {
  subject: string;
  body: string;
};

export type UpdateMessageInput = Partial<CreateMessageInput>;

const dataFilePath = path.join(
  process.cwd(),
  "src",
  "app",
  "message",
  "_data",
  "messages.json",
);

function isErrnoException(value: unknown): value is NodeJS.ErrnoException {
  return value instanceof Error && typeof (value as NodeJS.ErrnoException).code === "string";
}

async function readMessages(): Promise<Message[]> {
  try {
    const raw = await readFile(dataFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMessage);
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeMessages(messages: Message[]) {
  await writeFile(dataFilePath, JSON.stringify(messages, null, 2) + "\n", "utf8");
}

function isMessage(value: unknown): value is Message {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.subject === "string" &&
    typeof record.body === "string"
  );
}

function nextId(messages: Message[]) {
  const max = messages.reduce((acc, m) => {
    const n = Number.parseInt(m.id, 10);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return String(max + 1);
}

export async function listMessages(): Promise<Message[]> {
  const messages = await readMessages();
  return messages;
}

export async function getMessageById(id: string): Promise<Message | null> {
  const messages = await readMessages();
  return messages.find((m) => m.id === id) ?? null;
}

export async function createMessage(input: CreateMessageInput): Promise<Message> {
  const subject = input.subject?.trim();
  const body = input.body?.trim();
  if (!subject || !body) throw new Error("subject and body are required");

  const messages = await readMessages();
  const message: Message = { id: nextId(messages), subject, body };
  await writeMessages([message, ...messages]);
  return message;
}

export async function updateMessage(
  id: string,
  input: UpdateMessageInput,
): Promise<Message | null> {
  const messages = await readMessages();
  const idx = messages.findIndex((m) => m.id === id);
  if (idx === -1) return null;

  const current = messages[idx]!;
  const subject = input.subject?.trim();
  const body = input.body?.trim();

  const updated: Message = {
    ...current,
    ...(subject ? { subject } : {}),
    ...(body ? { body } : {}),
  };

  const next = messages.slice();
  next[idx] = updated;
  await writeMessages(next);
  return updated;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const messages = await readMessages();
  const next = messages.filter((m) => m.id !== id);
  if (next.length === messages.length) return false;
  await writeMessages(next);
  return true;
}
