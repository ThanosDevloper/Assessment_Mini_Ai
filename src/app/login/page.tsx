"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect them immediately to dashboard
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill out all required fields.");
      return;
    }

    if (isRegister && !name) {
      setError("Please specify your name.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: isRegister ? name : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Save user session in localStorage
      localStorage.setItem("user", JSON.stringify(data));
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(circle at top right, var(--primary-glow), transparent 45%), radial-gradient(circle at bottom left, var(--primary-glow), transparent 45%)",
      }}
    >
      <Header />
      
      <main
        className="flex-center"
        style={{
          flex: 1,
          padding: "2rem 1rem",
        }}
      >
        <div
          className="glass-panel animate-fade-in"
          style={{
            maxWidth: "420px",
            width: "100%",
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Logo Branding */}
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, var(--text-main), var(--primary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.25rem",
              }}
            >
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              {isRegister
                ? "Sign up to start generating premium AI copy"
                : "Sign in to access your saved content library"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            {error && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "var(--danger-glow)",
                  color: "var(--danger)",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : isRegister ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {/* Toggle Tab */}
          <div style={{ textAlign: "center", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
                transition: "color var(--transition-fast)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary)")}
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up for Free"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
