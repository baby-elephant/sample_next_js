export type Message = {
  id: string;
  subject: string;
  body: string;
};

export const messages: Message[] = [
  {
    id: "1",
    subject: "Welcome",
    body: "This is a demo message. Click other messages to open them as a modal (intercepted route).",
  },
  {
    id: "2",
    subject: "Parallel + Intercepted Routes",
    body: "The `@modal` slot renders an intercepted `message/[id]` route as a modal on top of the list.",
  },
  {
    id: "3",
    subject: "Direct navigation",
    body: "If you refresh on /message/3, you should see the full page instead of a modal.",
  },
];

export function getMessage(id: string) {
  return messages.find((m) => m.id === id);
}

