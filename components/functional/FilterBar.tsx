import React from "react";
import styles from "../../styles/FilterBar.module.css";
import { RefreshCcw } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSection {
  title: string;
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  sections: FilterSection[];
}

const FilterBar: React.FC<FilterBarProps> = ({ sections }) => {
  const handleChange = (section: FilterSection, value: string) => {
    const filterValue = value === "" ? undefined : value;
    section.active = filterValue;
    section.onChange(filterValue);
  };

  const handleResetAll = () => {
    sections.forEach((section) => {
      section.active = "";
      section.onChange(undefined); // Clear each filter
    });
  };

  return (
    <div className={styles.filterBar}>
      {sections.map((section) => (
        <div key={section.title} className={styles.filterSection}>
          <label className={styles.filterTitle}>{section.title}</label>
          <select
            title={section.title}
            value={section.active || ""} // Show empty string when active is undefined
            onChange={(e) => handleChange(section, e.target.value)}
            className={styles.filterDropdown}
          >
            <option value="">All</option>
            {section.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button title="refresh button" onClick={handleResetAll} className={styles.resetButton}>
        <RefreshCcw strokeWidth={3} />
      </button>
    </div>
  );
};

export default FilterBar;
