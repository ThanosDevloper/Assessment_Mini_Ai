"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import HistoryList, { HistoryItem } from "@/components/HistoryList";
import Generator from "@/components/Generator";
import styles from "@/styles/components/dashboard.module.css";

interface UserSession {
  id: string;
  email: string;
  name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Authenticate session on client mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
    } else {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem("user");
        router.push("/login");
      }
    }
  }, [router]);

  // Fetch saved drafts history for the authenticated user
  const fetchHistory = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/history?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to load history data.");
      }
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error("Error loading dashboard history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch history when user session becomes available
  useEffect(() => {
    if (user?.id) {
      fetchHistory(user.id);
    }
  }, [user, fetchHistory]);

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the selected content.");
      }

      // If deleted item was the active one, clear active selection
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }

      // Reload sidebar history
      if (user?.id) {
        fetchHistory(user.id);
      }
    } catch (error) {
      console.error("Delete history card error:", error);
      alert("Could not delete item. Please try again.");
    }
  };

  const handleSelectItem = (item: HistoryItem) => {
    setSelectedItem(item);
  };

  // Logout session handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setHistory([]);
    setSelectedItem(null);
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex-center" style={{ minHeight: "100vh", background: "var(--bg-app)" }}>
        <div className={styles.loadingBox}>
          <div className={styles.spinner} />
          <span>Verifying session credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(circle at top right, var(--primary-glow), transparent 45%), radial-gradient(circle at bottom left, var(--primary-glow), transparent 45%)",
      }}
    >
      <Header userName={user.name} onLogout={handleLogout} />

      <main className="main-content">
        <div className={styles.dashboardGrid}>
          {/* Left Column: History Panel */}
          {loading ? (
            <div className="glass-panel" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
              <div className={styles.spinner} />
            </div>
          ) : (
            <HistoryList
              items={history}
              activeId={selectedItem?.id}
              onSelectItem={handleSelectItem}
              onDeleteItem={handleDeleteHistoryItem}
            />
          )}

          {/* Right Column: Generation Panel */}
          <div className={styles.workspace}>
            <Generator
              userId={user.id}
              selectedItem={selectedItem}
              onSaveSuccess={() => user?.id && fetchHistory(user.id)}
              onClearSelection={() => setSelectedItem(null)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
