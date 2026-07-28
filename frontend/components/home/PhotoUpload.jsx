"use client";

import { useId } from "react";
import styles from "./PhotoUpload.module.css";
import { ACCEPTED_IMAGE_TYPES } from "./constants";

export default function PhotoUpload({ file, onChange, error, disabled }) {
  const inputId = useId();
  const accept = ACCEPTED_IMAGE_TYPES.join(",");

  return (
    <div className={`photo-upload ${styles.panel}`}>
      <label className={styles.label} htmlFor={inputId}>
        Photo
      </label>
      <p className={styles.hint}>JPEG, PNG or WebP up to 10 MB</p>

      <input
        id={inputId}
        type="file"
        accept={accept}
        className={styles.fileInput}
        disabled={disabled}
        onChange={(event) => {
          const selectedFile = event.target.files?.[0] || null;
          onChange(selectedFile);
        }}
      />

      <label
        className={`${styles.uploadButton} ${disabled ? styles.uploadButtonDisabled : ""}`}
        htmlFor={inputId}
      >
        {file ? "Change photo" : "Choose photo"}
      </label>

      {file && <p className={styles.fileName}>{file.name}</p>}
      {error && <p className={styles.hint}>{error}</p>}
    </div>
  );
}
