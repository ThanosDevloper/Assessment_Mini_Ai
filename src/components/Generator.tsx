"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/components/dashboard.module.css";
import { HistoryItem } from "./HistoryList";

interface GeneratorProps {
  userId: string;
  selectedItem: HistoryItem | null;
  onSaveSuccess: () => void;
  onClearSelection: () => void;
}

export default function Generator({
  userId,
  selectedItem,
  onSaveSuccess,
  onClearSelection,
}: GeneratorProps) {
  const [contentType, setContentType] = useState("Blog Post");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [wordLimit, setWordLimit] = useState(250);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Sync state if an item is selected from history sidebar
  useEffect(() => {
    if (selectedItem) {
      setContentType(selectedItem.contentType);
      setTopic(selectedItem.topic);
      setTone(selectedItem.tone);
      setResult(selectedItem.output);
      setSource("Loaded from database");
      setSaveStatus("saved");
      setError("");
    }
  }, [selectedItem]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please specify a topic or keyword first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");
    setSource("");
    setSaveStatus("idle");
    onClearSelection(); // Clear history active selection reference on new generate

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, topic, tone, wordLimit }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content.");
      }

      setResult(data.content);
      setSource(data.source);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!result) return;
    setSaveStatus("saving");
    setError("");

    try {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          prompt: `Generate a ${contentType} about "${topic}" in a ${tone} tone.`,
          output: result,
          contentType,
          topic,
          tone,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save to history database.");
      }

      setSaveStatus("saved");
      onSaveSuccess(); // Trigger sidebar refresh
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error saving record.");
      setSaveStatus("error");
    }
  };

  const handleCopyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportTxt = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${topic.toLowerCase().replace(/\s+/g, "_")}_draft.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!result) return;
    const exportData = {
      contentType,
      topic,
      tone,
      wordCount: result.split(/\s+/).filter(Boolean).length,
      generatedContent: result,
      timestamp: new Date().toISOString(),
      generatorSource: source,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${topic.toLowerCase().replace(/\s+/g, "_")}_draft.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = result ? result.split(/\s+/).filter(Boolean).length : 0;
  const charCount = result ? result.length : 0;

  // Form placeholder changes dynamically based on selection
  const getTopicPlaceholder = () => {
    switch (contentType) {
      case "Blog Post":
        return "e.g., 5 best features of TypeScript 5, remote work strategies...";
      case "Social Media Caption":
        return "e.g., launching my new web app, product launch countdown...";
      case "Email Draft":
        return "e.g., following up on partnership proposal, product updates...";
      case "Ad Copy":
        return "e.g., 20% discount on software agency services, premium coffee maker...";
      default:
        return "e.g., React development hooks, design trends...";
    }
  };

  return (
    <div className={`glass-panel ${styles.generatorCard}`}>
      <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>
        AI Content Workspace
      </h2>

      <form onSubmit={handleGenerate}>
        <div className={styles.formGrid}>
          {/* Content Type */}
          <div className="form-group">
            <label className="form-label">Content Type</label>
            <select
              className="form-control"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              disabled={loading}
            >
              <option value="Blog Post">Blog Post</option>
              <option value="Social Media Caption">Social Media Caption</option>
              <option value="Email Draft">Email Draft</option>
              <option value="Ad Copy">Ad Copy</option>
            </select>
          </div>

          {/* Tone Selector */}
          <div className="form-group">
            <label className="form-label">Tone of Voice</label>
            <select
              className="form-control"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={loading}
            >
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Persuasive">Persuasive</option>
              <option value="Witty">Witty</option>
              <option value="Informative">Informative</option>
            </select>
          </div>
        </div>

        {/* Topic Input */}
        <div className="form-group">
          <label className="form-label">Topic / Focus Keywords</label>
          <input
            type="text"
            className="form-control"
            placeholder={getTopicPlaceholder()}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Word Count Slider */}
        <div className={styles.sliderContainer}>
          <div className={styles.sliderHeader}>
            <span>Approximate Length</span>
            <span>{wordLimit} words</span>
          </div>
          <input
            type="range"
            min="50"
            max="500"
            step="25"
            className={styles.sliderInput}
            value={wordLimit}
            onChange={(e) => setWordLimit(parseInt(e.target.value))}
            disabled={loading}
          />
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", padding: "0.9rem" }}
          disabled={loading}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className={styles.spinner} style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
              Generating Copy with Grok AI...
            </span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                style={{ width: "1.25rem", height: "1.25rem" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 21l8.982-11.795m-8.982 6.702L18.018 9C19.1 7.824 18.028 6 16.5 6H11l.818-3.904m-1.818 3.904L9 9H4.5C2.973 9 1.9 10.824 2.982 12l8.982 11.795m-8.982-11.795L11.018 15"
                />
              </svg>
              Generate AI Content
            </span>
          )}
        </button>
      </form>

      {/* Error Alert Box */}
      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            background: "var(--danger-glow)",
            color: "var(--danger)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            fontSize: "0.9rem",
          }}
        >
          <strong>Error: </strong> {error}
        </div>
      )}

      {/* Result Display Pane */}
      {result && (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className={styles.sourceBadge}>{source}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {wordCount} words / {charCount} chars
              </span>
            </div>
            
            {/* Actions group */}
            <div className={styles.actionsGroup}>
              {/* Copy button */}
              <button
                onClick={handleCopyToClipboard}
                className="btn btn-secondary"
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                title="Copy generated text"
              >
                {copied ? "Copied! ✓" : "Copy"}
              </button>

              {/* Export dropdown */}
              <button
                onClick={handleExportTxt}
                className="btn btn-secondary"
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                title="Download draft as .txt"
              >
                TXT
              </button>
              <button
                onClick={handleExportJson}
                className="btn btn-secondary"
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                title="Download draft info as .json"
              >
                JSON
              </button>

              {/* Save content button */}
              <button
                onClick={handleSaveToHistory}
                className="btn btn-primary"
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.8rem",
                  background:
                    saveStatus === "saved"
                      ? "var(--success)"
                      : saveStatus === "saving"
                      ? "var(--text-muted)"
                      : "var(--primary)",
                }}
                disabled={saveStatus === "saved" || saveStatus === "saving"}
              >
                {saveStatus === "saved"
                  ? "Saved ✓"
                  : saveStatus === "saving"
                  ? "Saving..."
                  : "Save to History"}
              </button>
            </div>
          </div>

          <pre className={styles.resultTextarea}>{result}</pre>
        </div>
      )}
    </div>
  );
}
