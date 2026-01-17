"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

// styles.create のように CSSをオブジェクトとしてimportして使いたい場合、
// そのCSSは CSS Modules である必要があり、
// Next.jsでは通常 *.module.css がそれです（例: messageCreateForm.module.css）。
// *.css のままだと styles は作れません。
import styles from "./messageCreateForm.module.css";
import { createMessageBodySchema, type CreateMessageBody } from "../api/schema";

export default function MessageCreateForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<CreateMessageBody>({
    resolver: zodResolver(createMessageBodySchema),
    defaultValues: { subject: "", body: "" },
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await fetch("/message/api", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to create message");
      }

      reset();
      router.refresh();
    } catch (e) {
      setError("root", {
        message: e instanceof Error ? e.message : "Failed to create message",
      });
    }
  });

  const subjectError = errors.subject?.message;
  const bodyError = errors.body?.message;
  const rootError = errors.root?.message;

  return (
    <form
      onSubmit={onSubmit}
      className={styles.create}
      noValidate
      aria-busy={isSubmitting}
    >
      <h2 className={styles.createTitle}>Create (MVP)</h2>
      <div className={styles.createRow}>
        <label className={styles.createField}>
          <div className={styles.createLabel}>Subject</div>
          <input
            className={styles.createInput}
            {...register("subject")}
            placeholder="Hello"
            aria-invalid={Boolean(subjectError)}
            aria-describedby={subjectError ? "message-subject-error" : undefined}
          />
          {subjectError ? (
            <div className={styles.createFieldError} id="message-subject-error">
              {subjectError}
            </div>
          ) : null}
        </label>

        <label className={styles.createField}>
          <div className={styles.createLabel}>Body</div>
          <textarea
            className={styles.createTextarea}
            {...register("body")}
            placeholder="Write something..."
            rows={3}
            aria-invalid={Boolean(bodyError)}
            aria-describedby={bodyError ? "message-body-error" : undefined}
          />
          {bodyError ? (
            <div className={styles.createFieldError} id="message-body-error">
              {bodyError}
            </div>
          ) : null}
        </label>
      </div>

      <div className={styles.createActions}>
        <button className={styles.createButton} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </button>
        {rootError ? <div className={styles.createError}>{rootError}</div> : null}
      </div>
    </form>
  );
}
