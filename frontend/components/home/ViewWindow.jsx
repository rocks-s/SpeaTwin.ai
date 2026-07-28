"use client";

import styles from "./ViewWindow.module.css";

export default function ViewWindow({ previewUrl, isProcessing }) {
  return (
    <div className={`view-window ${styles.viewWindow}`}>
      {isProcessing ? (
        <div className={styles.placeholder}>
          <p className={styles.placeholderTitle}>
            Please wait, we are processing your order.
          </p>
        </div>
      ) : previewUrl ? (
        <img
          src={previewUrl}
          alt="Uploaded portrait preview"
          className={styles.previewImage}
        />
      ) : (
        <div className={styles.placeholder}>
          <p className={styles.placeholderTitle}>Upload a portrait photo</p>
          <p className={styles.placeholderHint}>
            Your image will appear here after upload
          </p>
        </div>
      )}
    </div>
  );
}
