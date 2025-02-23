import React, { useState } from 'react';
import { Box, Button, Paper, Typography, LinearProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ReportUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid Excel (.xlsx) file');
      setFile(null);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(`Successfully processed ${data.vulnerabilities_count} vulnerabilities`);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload VAPT Report
      </Typography>

      {/* File Upload Area */}
      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          mb: 2,
          cursor: 'pointer',
          '&:hover': { borderColor: 'primary.main' },
        }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".xlsx"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography>
          {file ? file.name : 'Drag and drop or click to select Excel file'}
        </Typography>
      </Box>

      {/* Loading Progress */}
      {loading && <LinearProgress sx={{ mt: 2, mb: 2 }} />}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Upload Button */}
      <Button
        variant="contained"
        fullWidth
        disabled={!file || loading}
        onClick={handleUpload}
        sx={{ mt: 2 }}
      >
        Upload Report
      </Button>
    </Paper>
  );
};

export default ReportUpload;