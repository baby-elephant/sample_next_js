import type { ReactNode } from "react";
import styles from "./bento.module.css";

export default function BentoLayout({
  children,
  sidebar,
  main,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
}) {
  return (
    <div className={styles.frame}>
      <header className={styles.header}>{children}</header>
      <div className={styles.columns}>
        <aside className={styles.sidebar}>{sidebar}</aside>
        <section className={styles.main}>{main}</section>
      </div>
    </div>
  );
}
