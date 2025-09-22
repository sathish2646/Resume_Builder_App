import React from "react";

const ROLE_OPTIONS = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Project Manager",
  "Designer",
];

const COMPANY_OPTIONS = [
  "Google",
  "Amazon",
  "Microsoft",
  "Facebook",
  "Apple",
  "Netflix",
];

const DEGREE_OPTIONS = [
  "10th Standard",
  "12th Standard",
  "B.Sc Computer Science",
  "B.Tech Information Technology",
  "M.Sc Software Engineering",
  "MBA",
  "PhD",
  "BCA",
  "Diploma",
  "Certificate",
  "Other",
];

export default function SectionEditor({ section, onUpdate }) {
  if (!section) return null;

  // --- EXPERIENCE ---
  const handleJobChange = (idx, field, value) => {
    const newJobs = [...(section.jobs || [])];
    newJobs[idx][field] = value;
    onUpdate({ jobs: newJobs });
  };

  const addJob = () => {
    const newJobs = [...(section.jobs || []), { role: "", company: "", date: "" }];
    onUpdate({ jobs: newJobs });
  };

  const removeJob = (idx) => {
    const newJobs = [...(section.jobs || [])];
    newJobs.splice(idx, 1);
    onUpdate({ jobs: newJobs });
  };

  // --- EDUCATION ---
  const handleSchoolChange = (idx, field, value) => {
    const newSchools = [...(section.schools || [])];
    newSchools[idx][field] = value;
    onUpdate({ schools: newSchools });
  };

  const addSchool = () => {
    const newSchools = [
      ...(section.schools || []),
      { degree: "", school: "", year: "", percentage: "" },
    ];
    onUpdate({ schools: newSchools });
  };

  const removeSchool = (idx) => {
    const newSchools = [...(section.schools || [])];
    newSchools.splice(idx, 1);
    onUpdate({ schools: newSchools });
  };

  return (
    <div>
   <div className="edit-section">
  <h3>Edit {section.title}</h3>
  <label>Title :</label>
  <input
    value={section.title}
    onChange={(e) => onUpdate({ title: e.target.value })}
  />

  <label>Content :</label>
  <textarea
    rows={5}
    cols={30}
    value={section.content}
    onChange={(e) => onUpdate({ content: e.target.value })}
  />
</div>

      <div className="section-editor">
        {/* Experience Section ////////////////////////////////////////////////////*/}
        {section.type === "experience" && (
          <div>
            {(section.jobs || []).map((job, idx) => (
              <div key={idx} className="entry-card">
                <label>Role</label>
                <input
                  list={`role-options-${idx}`}
                  value={job.role}
                  onChange={(e) => handleJobChange(idx, "role", e.target.value)}
                />
                <datalist id={`role-options-${idx}`}>
                  {ROLE_OPTIONS.map((role, i) => (
                    <option key={i} value={role} />
                  ))}
                </datalist>

                <label>Company</label>
                <input
                  list={`company-options-${idx}`}
                  value={job.company}
                  onChange={(e) => handleJobChange(idx, "company", e.target.value)}
                />
                <datalist id={`company-options-${idx}`}>
                  {COMPANY_OPTIONS.map((comp, i) => (
                    <option key={i} value={comp} />
                  ))}
                </datalist>

                <label>Date</label>
                <input
                  type="month"
                  value={job.date}
                  onChange={(e) => handleJobChange(idx, "date", e.target.value)}
                />

                <button className="remove-btn" onClick={() => removeJob(idx)}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={addJob}>+ Add Job</button>
          </div>
        )}

        {/* Education Section///////////////////////////////////////////////////////// */}
        {section.type === "education" && (
          <div>
            {(section.schools || []).map((school, idx) => (
              <div key={idx} className="entry-card">
                <label>Degree</label>
                <input
                  list={`degree-options-${idx}`}
                  value={school.degree}
                  onChange={(e) => handleSchoolChange(idx, "degree", e.target.value)}
                />
                <datalist id={`degree-options-${idx}`}>
                  {DEGREE_OPTIONS.map((deg, i) => (
                    <option key={i} value={deg} />
                  ))}
                </datalist>

                <label>School/University</label>
                <input
                  placeholder="School or University"
                  value={school.school}
                  onChange={(e) => handleSchoolChange(idx, "school", e.target.value)}
                />

                <label>Year</label>
                <input
                  type="number"
                  placeholder="2024"
                  value={school.year}
                  onChange={(e) => handleSchoolChange(idx, "year", e.target.value)}
                />

                <label>Percentage / Grade</label>
                <input
                  type="text"
                  placeholder="85% / A+"
                  value={school.percentage}
                  onChange={(e) => handleSchoolChange(idx, "percentage", e.target.value)}
                />

                <button className="remove-btn" onClick={() => removeSchool(idx)}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={addSchool}>+ Add Education</button>
          </div>
        )}
      </div>
    </div>
  );
}
