"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioResume } from "@/app/data/portfolioTypes";
import { getResumeApiPath, getResumeDownloadApiPath } from "@/app/lib/resumePaths";

type ResumePickerButtonProps = {
  resumes: PortfolioResume[];
  label: string;
  className?: string;
  icon?: React.ReactNode;
};

type ResumeAction = "view" | "download";

export default function ResumePickerButton({
  resumes,
  label,
  className = "",
  icon,
}: ResumePickerButtonProps) {
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ResumeAction | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (resumes.length === 0) {
    return null;
  }

  const openPicker = (action: ResumeAction) => {
    setActiveAction(action);
    setOpen(true);
  };

  if (resumes.length === 1) {
    const resume = resumes[0];

    return (
      <div className="resume-action-row">
        <a
          href={getResumeApiPath(resume.id)}
          target="_blank"
          rel="noopener noreferrer"
          className={`resume-action-btn ${className}`.trim()}
          aria-label={`View ${resume.title}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>View CV</span>
        </a>
        <a
          href={getResumeDownloadApiPath(resume.id)}
          className={`resume-action-btn ${className}`.trim()}
          aria-label={`Download ${resume.title}`}
          download
        >
          {icon ?? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          <span>Download CV</span>
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="resume-action-row">
        <button
          type="button"
          className={`resume-action-btn ${className}`.trim()}
          onClick={() => openPicker("view")}
          aria-label={label ? `View ${label}` : "View resume"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>View CV</span>
        </button>
        <button
          type="button"
          className={`resume-action-btn ${className}`.trim()}
          onClick={() => openPicker("download")}
          aria-label={label ? `Download ${label}` : "Download resume"}
        >
          {icon ?? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          <span>Download CV</span>
        </button>
      </div>

      {open && (
        <div
          className="resume-picker-backdrop"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            ref={dialogRef}
            className="resume-picker-dialog glass-card"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a resume"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="resume-picker-header">
              <h3>{activeAction === "download" ? "Choose a Resume to Download" : "Choose a Resume to View"}</h3>
              <button
                type="button"
                className="resume-picker-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="resume-picker-list">
              {resumes.map((resume) => {
                const href =
                  activeAction === "download"
                    ? getResumeDownloadApiPath(resume.id)
                    : getResumeApiPath(resume.id);

                return (
                  <a
                    key={resume.id}
                    href={href}
                    target={activeAction === "view" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="resume-picker-item"
                    onClick={() => setOpen(false)}
                    download={activeAction === "download" ? "" : undefined}
                  >
                    <span>{resume.title}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
