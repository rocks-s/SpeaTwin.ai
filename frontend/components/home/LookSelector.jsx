"use client";

import styles from "./Selector.module.css";

export default function LookSelector({ value, options, onChange, disabled }) {
  return (
    <div className={`look-selector ${styles.panel}`}>
      <label className={styles.label} htmlFor="look-selector">
        Look
      </label>

      <select
        id="look-selector"
        className={styles.select}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
