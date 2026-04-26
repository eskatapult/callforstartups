"use client";

import { useRef } from "react";
import type { DeckAttachment } from "@/lib/types";
import { CONTENT } from "@/lib/content";

interface FileUploadProps {
  file: DeckAttachment | null;
  onChange: (v: DeckAttachment | null) => void;
  maxSizeMb?: number;
  error?: string;
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

export default function FileUpload({ file, onChange, maxSizeMb = 25, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const f = CONTENT.fields.deck;

  function handle(raw: File | undefined) {
    if (!raw) return;
    if (raw.size > maxSizeMb * 1024 * 1024) {
      alert(`File exceeds ${maxSizeMb} MB limit.`);
      return;
    }
    onChange({ file: raw, name: raw.name, size: raw.size, type: raw.type });
  }

  if (file) {
    const ext = (file.name.split(".").pop() ?? "FILE").toUpperCase().slice(0, 4);
    return (
      <div className="file-attached">
        <div className="file-icon">{ext}</div>
        <div className="file-meta">
          <div className="file-name">{file.name}</div>
          <div className="file-size">
            {fmtSize(file.size)} · {file.file ? "ready" : "previously attached — please re-upload"}
          </div>
        </div>
        <button className="file-remove" onClick={() => onChange(null)}>
          {f.removeButton}
        </button>
      </div>
    );
  }

  return (
    <div
      className={"file-drop" + (error ? " error" : "")}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handle(e.dataTransfer.files[0]);
      }}
    >
      <div className="file-drop-icon">↑</div>
      <div className="file-drop-title">{f.dropTitle}</div>
      <div className="file-drop-hint">{f.dropHint}</div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.ppt,.pptx,.key"
        style={{ display: "none" }}
        onChange={(e) => handle(e.target.files?.[0])}
      />
    </div>
  );
}
