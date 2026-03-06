// src/components/Filters.jsx
import { useState } from "react";

export default function Filters({ config }) {
  const [selected, setSelected] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [pendingSelected, setPendingSelected] = useState([]);

  const toggleOption = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const openModal = (section) => {
    setPendingSelected([...selected]);
    setActiveModal(section);
  };

  const closeModal = () => setActiveModal(null);

  const applyModal = () => {
    setSelected([...pendingSelected]);
    setActiveModal(null);
  };

  const togglePending = (value) => {
    setPendingSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const getActiveCount = (section) =>
    section.options.filter((opt) => selected.includes(opt)).length;

  return (
    <>
      {/* ── MOBILE: chip bar ── */}
      <div className="filter-chips-bar">
        <button
          className={`filter-chip filter-chip--icon ${selected.length > 0 ? "filter-chip--active" : ""}`}
          onClick={() => openModal(config[0])}
          aria-label="Todos los filtros"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
          {selected.length > 0 && <span className="chip-count">{selected.length}</span>}
        </button>

        {config.map((section) => {
          const count = getActiveCount(section);
          return (
            <button
              key={section.title}
              className={`filter-chip ${count > 0 ? "filter-chip--active" : ""}`}
              onClick={() => openModal(section)}
            >
              {section.title}
              {count > 0 && ` (${count})`}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 4 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          );
        })}
      </div>

      {/* ── DESKTOP: sidebar ── */}
      <aside className="filters filters--desktop">
        <h2>Filtros</h2>
        {config.map((section) => (
          <section key={section.title}>
            <h3>{section.title}</h3>
            {section.type === "buttons" && (
              <div className="size-grid">
                {section.options.map((opt) => (
                  <button
                    key={opt}
                    className={`size-button ${selected.includes(opt) ? "active" : ""}`}
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
                  <input
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={() => toggleOption(opt)}
                  />
                  <span className="filter-label">{opt}</span>
                </label>
              ))}
          </section>
        ))}
      </aside>

      {/* ── MODAL ── */}
      {activeModal && (
        <div className="filter-modal-overlay" onClick={closeModal}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h3>Filtrar por {activeModal.title}</h3>
              <button className="filter-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="filter-modal-body">
              {activeModal.type === "checkbox" &&
                activeModal.options.map((opt) => (
                  <label key={opt} className="filter-modal-option">
                    <input
                      type="checkbox"
                      checked={pendingSelected.includes(opt)}
                      onChange={() => togglePending(opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}

              {activeModal.type === "buttons" && (
                <div className="size-grid">
                  {activeModal.options.map((opt) => (
                    <button
                      key={opt}
                      className={`size-button ${pendingSelected.includes(opt) ? "active" : ""}`}
                      onClick={() => togglePending(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-modal-footer">
              <button className="filter-modal-apply" onClick={applyModal}>
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}