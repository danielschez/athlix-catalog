/* src/components/Filters.jsx */
import { useState } from "react";

export default function Filters() {
  const [selectedSizes, setSelectedSizes] = useState([]);

  const sizes = [23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  return (
    <aside className="filters">
      <h2>Filtros</h2>
      {/*
      <section>
        <h3>Género</h3>
        <label className="filter-option">
          <input type="checkbox" />
          <span className="filter-label">Hombre</span>
        </label>
        <label className="filter-option">
          <input type="checkbox" />
          <span className="filter-label">Mujer</span>
        </label>
      </section>

      <section>
        <h3>Niños</h3>
        <label className="filter-option">
          <input type="checkbox" />
          <span className="filter-label">Niño</span>
        </label>
        <label className="filter-option">
          <input type="checkbox" />
          <span className="filter-label">Niña</span>
        </label>
      </section>
      */}
      {/* 
      <section>
        <h3>Comprar por precio</h3>
        <label className="filter-option">
          <input type="checkbox" />
          <span className="filter-label">Menos de $2,500</span>
        </label>
        <label className="filter-option">
          <input type="checkbox" />
          <span className="filter-label">$2,500 - $5,000</span>
        </label>
      </section>
      */}
      <section>
        <h3>Tallas</h3>
        <div className="size-grid">
          {sizes.map(size => (
            <button 
              key={size}
              className={`size-button ${selectedSizes.includes(size) ? 'active' : ''}`}
              onClick={() => toggleSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </section>

        {/*
      <section>
        <h3>Color</h3>
        <label className="filter-option">
          <input type="checkbox" />
          <span className="filter-label">Negro</span>
        </label>
        <label className="filter-option">
          <input type="checkbox" />
          <span className="filter-label">Blanco</span>
        </label>
        <label className="filter-option">
          <input type="checkbox" />
          <span className="filter-label">Gris</span>
        </label>
      </section>
      */}
    </aside>
  );
}