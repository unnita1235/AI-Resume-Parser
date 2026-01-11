import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(fileType)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a PDF or DOC file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/parse', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        onUploadSuccess(data.data);
        setFile(null);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Resume</h2>
      
      <div className="upload-area">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          id="file-input"
          className="file-input"
        />
        <label htmlFor="file-input" className="file-label">
          {file ? file.name : 'Choose File (PDF, DOC, DOCX)'}
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="upload-button"
      >
        {uploading ? 'Parsing...' : 'Upload & Parse'}
      </button>
    </div>
  );
}

export default FileUpload;
