"use client";

import styles from "./Selector.module.css";

export default function VoiceSelector({ value, options, onChange, disabled }) {
  return (
    <div className={`voice-selector ${styles.panel}`}>
      <label className={styles.label} htmlFor="voice-selector">
        Voice
      </label>

      <select
        id="voice-selector"
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
