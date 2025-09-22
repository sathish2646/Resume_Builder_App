import React from "react";

export default function Palette({ palette, onAdd }) {
  return (
    <div>
      {palette.map((p) => (
        <button key={p.type} onClick={() => onAdd(p.type)}>
          + {p.title}
        </button>
      ))}
    </div>
  );
}
