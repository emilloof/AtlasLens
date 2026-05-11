import React from "react";
import styles from "./filterSelector.module.css";
interface FilterSelectorProps {
  currentFilter?: string;
  onChange: (newFilter: string) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({ currentFilter, onChange }) => {
  return (
    <select value={currentFilter || ""} onChange={(e) => onChange(e.target.value)} className={styles.selectorWrapper}>
      <option value="">≡ Filter</option>
      <option value="grayscale">Grayscale 🗿</option>
      <option value="sepia">Sepia 🪶</option>
      <option value="cooltone">Cool Tone ❄️</option>
      <option value="warmtone">Warm Tone 🔥</option>
    </select>
  );
};

export default FilterSelector;
