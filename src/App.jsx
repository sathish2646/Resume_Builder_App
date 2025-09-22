import React, { useState, } from "react";
import Palette from "./components/Palette";
import SectionList from "./components/SectionList";
import SectionEditor from "./components/SectionEditor";
import ResumePreview from "./components/ResumePreview";
import "./App.css"

const genId = () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

const PALETTE = [
  { type: "name", title: "Full Name", content: "Enter your full name" },
  { type: "contact", title: "Contact", content: "Email, phone,Address..." },
  { type: "skills", title: "Skills", content: "List of skills..." },
  { type: "Language", title: "Language", content: "Tamil,English....." },
  { type: "summary", title: "Summary", content: "Write a short summary..." },
  { type: "experience", title: "Experience", content: "jobs,role,company...", jobs: [] },
  { type: "education", title: "Education", content: "school/college name,degree,year, percentage....", schools: [] },
  { type: "projects", title: "Projects", content: "Project description..." },
  { type: "social", title: "Social Media", content: "Enter socialLinks..." }

];

export default function App() {
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [styles, setStyles] = useState({
    fontSize: "14px",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#111827",
  });
  const [photo, setPhoto] = useState(null);
  const [template, setTemplate] = useState("classic",);
  const [theme, setTheme] = useState("blue");
  const [leftColColor, setLeftColColor] = useState("#f3f4f6");
  const [leftColTextColor, setLeftColTextColor] = useState("#111827");



  // Add section
  const addSection = (type) => {
    const base = PALETTE.find((s) => s.type === type);
    if (!base) return;
    const newSec = { id: genId(), ...base };
    setSections((prev) => [...prev, newSec]);
    setSelected(newSec.id);
  };

  // Update section
  const updateSection = (id, updated) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  // Delete section
  const removeSection = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (selected === id) setSelected(null);
  };


  return (
    <div className="app">
      <div className="editor">
        <h2>Sections</h2>
        <Palette palette={PALETTE} onAdd={addSection} />
        <SectionList
          sections={sections}
          selected={selected}
          onSelect={setSelected}
          onRemove={removeSection}
        />
        {sections.type === "name" && (
          <input
            type="text"
            value={sections.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Enter full name"
          />
        )}

        <h2>Style</h2>
        <label>Font Size</label>
        <select
          value={styles.fontSize}
          onChange={(e) => setStyles({ ...styles, fontSize: e.target.value })}
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="22px">22px</option>
        </select>


        <label>Font Family</label>
        <select
          value={styles.fontFamily}
          onChange={(e) => setStyles({ ...styles, fontFamily: e.target.value })}
        >
          <option value="Inter, Arial, sans-serif">Inter</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Helvetica, sans-serif">Helvetica</option>
        </select>

        <label>Font Color</label>
        <input
          type="color"
          value={styles.color}
          onChange={(e) => setStyles({ ...styles, color: e.target.value })}
        />
        <h2>Left Column Color</h2>
        <input
          type="color"
          value={leftColColor}
          onChange={(e) => setLeftColColor(e.target.value)}
        />
        <h2>Left Column Text Color</h2>
        <input
          type="color"
          value={leftColTextColor}
          onChange={(e) => setLeftColTextColor(e.target.value)}
        />




        <h2>Template</h2>
        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
          <option value="classic">Classic</option>
          <option value="modern">Modern</option>
          <option value="minimal">Minimal</option>
          <option value="stylish">stylish</option>
          <option value="two-column">Two Column</option>
          <option value="profile-two-column">Profile + Two Column</option>
        </select>

        <h2>Theme</h2>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="gray">Gray</option>
        </select>

        <h2>Photo</h2>
        <input
          type="file"
          onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))}
        />
        {photo && (
          <div>
            <button onClick={() => setPhoto(null)}>Remove Photo</button>
          </div>
        )}
      </div>

      <div className="preview">
        <ResumePreview
          sections={sections}
          setSections={setSections}
          styles={styles}
          photo={photo}
          template={template}
          theme={theme}
          leftColColor={leftColColor}
          leftColTextColor={leftColTextColor}
        />
      </div>
      <div className="section-editor" >
        {selected && (
          <SectionEditor
            section={sections.find((s) => s.id === selected)}
            onUpdate={(updated) => updateSection(selected, updated)}
          />
        )}
      </div>
    </div>
  );
}
