import React from "react";

export default function SectionList({ sections, selected, onSelect, onRemove }) {
  return (
    <ul>
      {sections.map((s) => (
        <li
          key={s.id}
          className={selected === s.id ? "active" : ""}
          onClick={() => onSelect(s.id)}
        >
          {s.title}
          <button
            className="danger"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(s.id);
            }}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
