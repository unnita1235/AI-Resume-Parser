import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResumeDisplay from './components/ResumeDisplay';
import './App.css';

function App() {
  const [resumeData, setResumeData] = useState(null);

  const handleUploadSuccess = (data) => {
    setResumeData(data);
  };

  return (
    <div className="App">
      <header>
        <h1>AI Resume Parser</h1>
        <p>Upload your resume to extract structured data</p>
      </header>
      
      <main>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
        <ResumeDisplay resumeData={resumeData} />
      </main>
    </div>
  );
}

export default App;
