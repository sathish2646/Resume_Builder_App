import React, { useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import html2pdf from "html2pdf.js";

export default function ResumePreview({
  sections,
  styles,
  photo,
  template,
  theme,
  setSections,
  leftColColor = "#f3f4f6",
  leftColTextColor = "#f3f4f6",
}) {
  const previewRef = useRef();

  const downloadResume = () => {
    const element = previewRef.current;
    const opt = {
      margin: 0.5,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1.5 },
      jsPDF: { unit: "mm", format: "A4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  // // Split sections into left/right for two-column layouts
  // const leftTypes = new Set(["contact", "skills", "Language", "social"]);
  // const rightTypes = new Set(["summary", "experience", "education", "projects"]);


  // --- helper functions ---
  const getLeftList = () => {
    if (template === "profile-two-column") {

      return sections.filter(
        (s) => ["contact", "skills", "Language", "social"].includes(s.type) && s.type !== "contact"
      );
    }
    return sections.filter((s) =>
      ["contact", "skills", "Language", "social"].includes(s.type)
    );
  };

  const getRightList = () =>
    sections.filter((s) =>
      ["summary", "experience", "education", "projects"].includes(s.type)
    );



  // Drag-and-drop handler
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // Two-column layouts
    if (template === "profile-two-column" || template === "two-column") {
      const left = getLeftList();
      const right = getRightList();

      // Same column move
      if (source.droppableId === destination.droppableId) {
        if (source.droppableId === "left-col" || source.droppableId === "left-column") {
          const newLeft = Array.from(left);
          const [moved] = newLeft.splice(source.index, 1);
          newLeft.splice(destination.index, 0, moved);
          setSections([...newLeft, ...right]);
          return;
        } else {
          const newRight = Array.from(right);
          const [moved] = newRight.splice(source.index, 1);
          newRight.splice(destination.index, 0, moved);
          setSections([...left, ...newRight]);
          return;
        }
      }

      // Cross-column move
      if (
        (source.droppableId === "left-col" && destination.droppableId === "right-col") ||
        (source.droppableId === "left-column" && destination.droppableId === "right-column")
      ) {
        const newLeft = Array.from(left);
        const newRight = Array.from(right);
        const [moved] = newLeft.splice(source.index, 1);
        newRight.splice(destination.index, 0, moved);
        setSections([...newLeft, ...newRight]);
        return;
      }

      if (
        (source.droppableId === "right-col" && destination.droppableId === "left-col") ||
        (source.droppableId === "right-column" && destination.droppableId === "left-column")
      ) {
        const newLeft = Array.from(left);
        const newRight = Array.from(right);
        const [moved] = newRight.splice(source.index, 1);
        newLeft.splice(destination.index, 0, moved);
        setSections([...newLeft, ...newRight]);
        return;
      }

      return;
    }

    // Single-column layout
    const items = Array.from(sections);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);
    setSections(items);
  };

  // Render text content with clickable links
  const renderContent = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      urlRegex.test(part) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  // Render structured content
  // Render structured content
  const renderSectionContent = (section) => {
    if (section.type === "name") {
      return <p style={{ fontWeight: "bold", fontSize: "19px", margin: 0 }}>{section.content}</p>;
    }
    if (section.type === "experience") {
      return (section.jobs || []).map((job, i) => (
        <div key={i} className="item">
          <h5>{job.role}</h5>
          <p>{job.company}</p>
          <span>{job.date}</span>
        </div>
      ));
    }

    if (section.type === "education") {
      return (section.schools || []).map((s, i) => (
        <div key={i} className="item">
          <h5>{s.degree}</h5>
          <p>{s.school}</p>
          <span>{s.year}</span>
          {s.percentage && <p>{s.percentage}</p>}
        </div>
      ));
    }

    return <p>{renderContent(section.content)}</p>;
  };

  const leftList = getLeftList();
  const rightList = getRightList();

  return (
    <>
      <div id="resume-preview">
        <div
          ref={previewRef}
          className={`resume ${template} theme-${theme}`}
          style={{
            fontSize: styles.fontSize,
            fontFamily: styles.fontFamily,
            color: styles.color,
          }}
        >
          {/* Single DragDropContext wraps all layouts */}
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {/* PROFILE TWO-COLUMN TEMPLATE */}
            {template === "profile-two-column" ? (
              <div className="resume-profile-two-column">
                {/* TOP ROW: Photo + Contact */}
                <div className="top-row">
                  {photo && <img src={photo} alt="Profile" className="resume-photo" />}
                  <div className="contact-section">
                    {/* Name section */}
                    {sections
                      .filter((s) => s.type === "name")
                      .map((section) => (
                        <div key={section.id} className="resume-section name-section">
                          <span >
                            {section.content}
                          </span>

                        </div>
                      ))}

                    {/* Contact and other left-side info */}
                    {sections
                      .filter((s) => s.type === "contact")
                      .map((section) => (
                        <div key={section.id} className="resume-section">
                          {renderSectionContent(section)}
                        </div>
                      ))}
                  </div>
                </div>


                {/* BOTTOM ROW: TWO COLUMNS */}
                <div className="bottom-row">
                  <Droppable droppableId="left-col">
                    {(provided) => (
                      <div className="left-col" ref={provided.innerRef} {...provided.droppableProps}>
                        {leftList.map((section, index) => (
                          <Draggable key={section.id} draggableId={String(section.id)} index={index}>
                            {(prov, snapshot) => (
                              <div
                                className={`resume-section ${snapshot.isDragging ? "dragging" : ""}`}
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                              >
                                <div key={section.id} className={`resume-section ${section.type}`}>
                                  <h4>{section.title}</h4>
                                  {renderSectionContent(section)}
                                </div>

                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="right-col">
                    {(provided) => (
                      <div className="right-col" ref={provided.innerRef} {...provided.droppableProps}>
                        {rightList.map((section, index) => (
                          <Draggable key={section.id} draggableId={String(section.id)} index={index}>
                            {(prov, snapshot) => (
                              <div
                                className={`resume-section ${snapshot.isDragging ? "dragging" : ""}`}
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                              >
                                <div key={section.id} className={`resume-section ${section.type}`}>
                                  <h4>{section.title}</h4>
                                  {renderSectionContent(section)}
                                </div>

                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ) : template === "two-column" ? (    ////////////////////////////////////////tempLATE two-column */}
              <div className="resume-two-column">
                <Droppable droppableId="left-column">
                  {(provided) => (
                    <div
                      className="left-col"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ backgroundColor: leftColColor , color: leftColTextColor }}
                    >
                      {photo && <img src={photo} alt="Profile" className="resume-photo" />}
                      <div className="contact-section">
                        {/* Name section */}
                        {sections.filter(s => s.type === "name").map(section => (
                          <div key={section.id} className="resume-section name-section">
                            {renderSectionContent(section)}
                          </div>
                        ))}

                        {/* Contact section */}
                        {sections.filter(s => s.type === "contact").map(section => (
                          <div key={section.id} className="resume-section">
                          </div>
                        ))}
                      </div>
                      {leftList.map((section, index) => (
                        <Draggable key={section.id} draggableId={String(section.id)} index={index}>
                          {(prov, snapshot) => (
                            <div
                              className={`resume-section ${snapshot.isDragging ? "dragging" : ""}`}
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                            >
                              <div key={section.id} className={`resume-section ${section.type}`}>
                                <h4>{section.title}</h4>
                                {renderSectionContent(section)}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Droppable droppableId="right-column">
                  {(provided) => (
                    <div className="right-col" ref={provided.innerRef} {...provided.droppableProps}>
                      {rightList.map((section, index) => (
                        <Draggable key={section.id} draggableId={String(section.id)} index={index}>
                          {(prov, snapshot) => (
                            <div
                              className={`resume-section ${snapshot.isDragging ? "dragging" : ""}`}
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                            >
                              <div key={section.id} className={`resume-section ${section.type}`}>
                                <h4>{section.title}</h4>
                                {renderSectionContent(section)}
                              </div>

                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ) : (
              // Single-column template
              <Droppable droppableId="resume-sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {/* Name on top */}
                    {["classic", "modern", "minimal", "stylish"].includes(template) && (
                      <div className="photo-name-row">
                        {photo && <img src={photo} alt="Profile" className="resume-photo" />}
                        {sections.filter(s => s.type === "name").map(section => (
                          <div key={section.id} className="resume-section name-section">
                            <span >
                              {section.content}
                            </span>

                          </div>
                        ))}
                      </div>
                    )}


                    {sections.filter(s => s.type !== "name").map((section, index) => (
                      <Draggable key={section.id} draggableId={String(section.id)} index={index}>
                        {(prov, snapshot) => (
                          <div
                            className={`resume-section ${snapshot.isDragging ? "dragging" : ""}`}
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                          >
                            <h4>{section.title}</h4>
                            {renderSectionContent(section)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

            )}
          </DragDropContext>
        </div>
      </div>

      <button onClick={downloadResume}>Download Resume as PDF</button>
    </>
  );
}
