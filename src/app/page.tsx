"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/components/dashboard.module.css";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div
      className="flex-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-app)",
        background: "radial-gradient(circle at top right, var(--primary-glow), transparent 45%), radial-gradient(circle at bottom left, var(--primary-glow), transparent 45%)",
      }}
    >
      <div className={styles.loadingBox}>
        <div className={styles.spinner} />
        <span style={{ fontSize: "0.9rem", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
          REDIRECTING...
        </span>
      </div>
    </div>
  );
}
