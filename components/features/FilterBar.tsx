import React, { useEffect, useMemo, useState, useRef } from "react";
import styles from "../../styles/Filterbar.module.css";
import { RefreshCcw, ChevronDown } from "lucide-react";

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const pillRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const hasActiveFilters = useMemo(
    () => sections.some((section) => !!section.active),
    [sections]
  );

  const handleChange = (section: FilterSection | undefined, value: string) => {
    try {
      section?.onChange(value || "");
    } catch (error) {
      console.error("Change failed:", error);
    }

    console.groupEnd();
    setOpenDropdown(null);
  };

  const handleResetAll = () => {
    sections.forEach((section) => {
      section.onChange("");
    });
  };

  const toggleDropdown = (title: string) => {
    if (openDropdown === title) {
      setOpenDropdown(null);
    } else {
      const pillElement = pillRefs.current[title];
      if (pillElement) {
        const rect = pillElement.getBoundingClientRect();
        
        setDropdownPosition({
          top: rect.top + 4,
          left: rect.left,
        });
      }
      setOpenDropdown(title);
    }
  };

  const getActiveLabel = (section: FilterSection) => {
    if (!section.active) return section.title;
    const activeOption = section.options.find(
      (opt) => opt.value === section.active
    );
    return activeOption ? activeOption.label : section.title;
  };

  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, [sections]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openDropdown) return;

      const target = event.target as Element;
      const clickedOnPill = target.closest(`.${styles.filterPill}`);
      const clickedInDropdown = target.closest(`.${styles.dropdownMenu}`);

      // Only close if clicking outside both the pill and dropdown
      if (!clickedOnPill && !clickedInDropdown) {
        setOpenDropdown(null);
      }
    };

    // Use 'click' instead of 'mousedown' to allow dropdown clicks to process first
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdown, styles]);

  // Reposition dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (openDropdown) {
        const pillElement = pillRefs.current[openDropdown];
        if (pillElement) {
          const rect = pillElement.getBoundingClientRect();
          setDropdownPosition({
            top: rect.top + 4,
            left: rect.left,
          });
        }
      }
    };

    if (openDropdown) {
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }
  }, [openDropdown]);

  return (
    <div className={styles.filterBarContainer}>
      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>Filters:</span>
        {sections.map((section) => (
          <div
            key={`${section.title}-${refreshKey}`}
            className={styles.filterSection}
          >
            <div className={styles.filterPillContainer}>
              <button
                ref={(el) => {
                  pillRefs.current[section.title] = el;
                }}
                className={`${styles.filterPill} ${
                  section.active ? styles.active : ""
                }`}
                onClick={() => toggleDropdown(section.title)}
              >
                {getActiveLabel(section)}
                <ChevronDown size={16} className={styles.chevron} />
              </button>
            </div>
          </div>
        ))}
        {hasActiveFilters && (
          <button
            title="Reset all filters"
            onClick={handleResetAll}
            className={styles.resetButton}
          >
            <RefreshCcw strokeWidth={3} size={16} />
          </button>
        )}
      </div>
      {openDropdown && (
        <div
          className={styles.dropdownMenu}
          style={{
            left: `${dropdownPosition.left}px`,
          }}
        >
          {sections
            .find((section) => section.title === openDropdown)
            ?.options.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.dropdownItem} ${
                  sections.find((s) => s.title === openDropdown)?.active ===
                  opt.value
                    ? styles.selected
                    : ""
                }`}
                onClick={() => {
                  const section = sections.find(
                    (s) => s.title === openDropdown
                  );
                  handleChange(section, opt.value);
                }}
              >
                {opt.label}
              </button>
            ))}
          <button
            className={styles.dropdownItem}
            onClick={() => {
              const section = sections.find((s) => s.title === openDropdown);
              handleChange(section, "");
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
