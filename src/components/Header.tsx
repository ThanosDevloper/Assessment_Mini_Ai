"use client";

import ThemeToggle from "./ThemeToggle";
import { useRouter } from "next/navigation";

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
}

export default function Header({ userName, onLogout }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return (
    <header
      className="glass-panel"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        borderRadius: "0 0 var(--radius-md) var(--radius-md)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderTop: "none",
        marginBottom: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Brand Icon SVG */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--border-focus))",
            color: "white",
            padding: "0.5rem",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            style={{ width: "1.25rem", height: "1.25rem" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 21l8.982-11.795m-8.982 6.702L18.018 9C19.1 7.824 18.028 6 16.5 6H11l.818-3.904m-1.818 3.904L9 9H4.5C2.973 9 1.9 10.824 2.982 12l8.982 11.795m-8.982-11.795L11.018 15"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: 800,
            background: "linear-gradient(to right, var(--text-main), var(--primary))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.03em",
          }}
        >
          WriteUp
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {userName && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
              }}
            >
              Logged in as <strong style={{ color: "var(--text-main)" }}>{userName}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.8rem",
                borderRadius: "var(--radius-sm)",
              }}
            >
              Sign Out
            </button>
          </div>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
