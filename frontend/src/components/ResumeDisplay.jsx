import React from 'react';
import './ResumeDisplay.css';

function ResumeDisplay({ resumeData }) {
  if (!resumeData) {
    return null;
  }

  return (
    <div className="resume-display">
      <h2>Parsed Resume Data</h2>

      <section className="section">
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> {resumeData.name || 'N/A'}</p>
        <p><strong>Email:</strong> {resumeData.contact?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {resumeData.contact?.phone || 'N/A'}</p>
        <p><strong>LinkedIn:</strong> {resumeData.contact?.linkedin || 'N/A'}</p>
        <p><strong>GitHub:</strong> {resumeData.contact?.github || 'N/A'}</p>
      </section>

      <section className="section">
        <h3>Skills</h3>
        <div className="skills-container">
          {resumeData.skills && resumeData.skills.length > 0 ? (
            resumeData.skills.map((skill, index) => (
              <span key={index} className="skill-badge">{skill}</span>
            ))
          ) : (
            <p>No skills detected</p>
          )}
        </div>
      </section>

      <section className="section">
        <h3>Experience</h3>
        {resumeData.experience && resumeData.experience.length > 0 ? (
          <ul>
            {resumeData.experience.map((exp, index) => (
              <li key={index}>{exp}</li>
            ))}
          </ul>
        ) : (
          <p>No experience information found</p>
        )}
      </section>

      <section className="section">
        <h3>Education</h3>
        {resumeData.education && resumeData.education.length > 0 ? (
          <ul>
            {resumeData.education.map((edu, index) => (
              <li key={index}>{edu}</li>
            ))}
          </ul>
        ) : (
          <p>No education information found</p>
        )}
      </section>
    </div>
  );
}

export default ResumeDisplay;
