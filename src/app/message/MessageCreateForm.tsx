"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import styles from "./message.module.css";

export default function MessageCreateForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/message/api", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to create message");
      }

      setSubject("");
      setBody("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create message");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.create}>
      <h2 className={styles.createTitle}>Create (MVP)</h2>
      <div className={styles.createRow}>
        <label className={styles.createField}>
          <div className={styles.createLabel}>Subject</div>
          <input
            className={styles.createInput}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Hello"
            required
          />
        </label>

        <label className={styles.createField}>
          <div className={styles.createLabel}>Body</div>
          <textarea
            className={styles.createTextarea}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write something..."
            rows={3}
            required
          />
        </label>
      </div>

      <div className={styles.createActions}>
        <button className={styles.createButton} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </button>
        {error ? <div className={styles.createError}>{error}</div> : null}
      </div>
    </form>
  );
}
