// src/components/Filters.jsx
import { useState } from "react";

export default function Filters({ config }) {
  const [selected, setSelected] = useState([]);

  const toggleOption = (value) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  return (
    <aside className="filters">
      <h2>Filtros</h2>

      {config.map((section) => (
        <section key={section.title}>
          <h3>{section.title}</h3>

          {section.type === "buttons" && (
            <div className="size-grid">
              {section.options.map((opt) => (
                <button
                  key={opt}
                  className={`size-button ${
                    selected.includes(opt) ? "active" : ""
                  }`}
                  onClick={() => toggleOption(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {section.type === "checkbox" &&
            section.options.map((opt) => (
              <label key={opt} className="filter-option">
                <input type="checkbox" />
                <span className="filter-label">{opt}</span>
              </label>
            ))}
        </section>
      ))}
    </aside>
  );
}