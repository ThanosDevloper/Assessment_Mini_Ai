"use client";

import { useState } from "react";
import styles from "@/styles/components/dashboard.module.css";

export interface HistoryItem {
  id: string;
  topic: string;
  contentType: string;
  tone: string;
  prompt: string;
  output: string;
  createdAt: string;
}

interface HistoryListProps {
  items: HistoryItem[];
  activeId?: string | null;
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export default function HistoryList({
  items,
  activeId,
  onSelectItem,
  onDeleteItem,
}: HistoryListProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.topic.toLowerCase().includes(search.toLowerCase()) ||
      item.output.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "" || item.contentType === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`glass-panel ${styles.sidebar}`}>
      <div className={styles.sidebarHeader}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Saved History</h3>
        
        {/* Search Bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            className="form-control"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.25rem", fontSize: "0.85rem" }}
          />
          {/* Search Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1rem",
              height: "1rem",
              color: "var(--text-muted)",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        {/* Filter Dropdown */}
        <select
          className="form-control"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ fontSize: "0.85rem", padding: "0.5rem 2rem 0.5rem 0.75rem" }}
        >
          <option value="">All Content Types</option>
          <option value="Blog Post">Blog Post</option>
          <option value="Social Media Caption">Social Media Caption</option>
          <option value="Email Draft">Email Draft</option>
          <option value="Ad Copy">Ad Copy</option>
        </select>
      </div>

      {/* History Items Container */}
      <div className={styles.historyList}>
        {filteredItems.length === 0 ? (
          <div className={styles.emptyHistory}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={{ width: "2rem", height: "2rem", marginBottom: "0.5rem", color: "var(--text-muted)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>No saved drafts found</span>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.historyCard} ${
                activeId === item.id ? styles.historyCardActive : ""
              }`}
              onClick={() => onSelectItem(item)}
              style={{ position: "relative" }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardTopic}>{item.topic}</span>
                <span className={styles.cardDate}>{formatDate(item.createdAt)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ flex: 1, marginRight: "1.5rem" }}>
                  <span className="badge badge-primary" style={{ fontSize: "0.65rem", marginBottom: "0.5rem" }}>
                    {item.contentType}
                  </span>
                  <p className={styles.cardExcerpt}>{item.output}</p>
                </div>
                {/* Delete button absolute at bottom-right of card */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Avoid selecting card
                    if (confirm("Delete this draft permanently?")) {
                      onDeleteItem(item.id);
                    }
                  }}
                  className="btn-icon"
                  style={{
                    padding: "0.3rem",
                    borderRadius: "4px",
                    position: "absolute",
                    bottom: "0.75rem",
                    right: "0.75rem",
                    opacity: 0.7,
                    border: "none",
                  }}
                  title="Delete Draft"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="var(--danger)"
                    style={{ width: "0.9rem", height: "0.9rem" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
