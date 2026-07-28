"use client";

import styles from "./SubmitButton.module.css";

export default function SubmitButton({ disabled, isLoading, onClick }) {
  return (
    <button
      type="button"
      className={`upload-btn ${styles.button}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? "Processing..." : "Generate video"}
    </button>
  );
}
