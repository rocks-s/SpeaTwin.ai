"use client";

import styles from "./ScriptBox.module.css";

export default function ScriptBox({
  value,
  onChange,
  maxLength = 2000,
  disabled,
}) {
  return (
    <div className={`script-box ${styles.panel}`}>
      <label className={styles.label} htmlFor="avatar-script">
        Script
      </label>

      <textarea
        id="avatar-script"
        className={styles.textarea}
        placeholder="Enter the text your digital twin should speak..."
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />

      <p className={styles.counter}>
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
