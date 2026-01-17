import Link from "next/link";
import styles from "./message.module.css";
import MessageCreateForm from "./_components/MessageCreateForm";
import { listMessages } from "./_lib/messages";

export default async function MessageListPage() {
  const messages = await listMessages();

  return (
    <main className={styles.page}>
      <h1>Messages</h1>
      <p className={styles.hint}>
        From this list, navigating to <code>/message/[id]</code> is intercepted and rendered in
        the <code>/message</code> segment&apos;s <code>@modal</code> slot.
      </p>

      <MessageCreateForm />

      <div className={styles.list}>
        {messages.map((m) => (
          <Link key={m.id} href={`/message/${m.id}`} className={styles.item}>
            <div className={styles.subject}>
              #{m.id} — {m.subject}
            </div>
            <div className={styles.hint}>Open details as a modal</div>
          </Link>
        ))}
      </div>

      <p className={styles.hint}>
        Tip: open <Link href="/message/1">/message/1</Link> in a new tab or refresh it to see the
        non-modal page.
      </p>
    </main>
  );
}
