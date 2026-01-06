import Link from "next/link";
import { getMessageById } from "./_lib/messages";

export default async function MessageDetails({ id }: { id: string }) {
  const message = await getMessageById(id);

  if (!message) {
    return (
      <div>
        <h2>Message not found</h2>
        <p>
          <Link href="/message">Back to list</Link>
        </p>
      </div>
    );
  }

  return (
    <article>
      <h2>{message.subject}</h2>
      <p>{message.body}</p>
      <p>
        <Link href="/message">Back to list</Link>
      </p>
    </article>
  );
}
