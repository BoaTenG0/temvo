/* eslint-disable no-unused-vars */

import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Link,
  DialogActions,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { TickCircle, InfoCircle, DocumentUpload } from 'iconsax-react';

export function BulkStudentsContent({ onAction, loading, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedStudents, setParsedStudents] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      parseCSVFile(file);
    }
  };

  const parseCSVFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      const students = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map((v) => v.trim());
        const student = {
          name: '',
          studentCode: '',
          className: '',
          status: 'valid'
        };

        // Map CSV columns to student properties
        headers.forEach((header, index) => {
          const value = values[index] || '';
          switch (header) {
            case 'name':
            case 'student name':
              student.name = value;
              break;
            case 'studentcode':
            case 'student code':
            case 'id':
              student.studentCode = value;
              break;
            case 'classname':
            case 'class':
              student.className = value;
              break;
          }
        });

        // Validate required fields
        if (!student.name) {
          student.status = 'error';
          student.error = 'Missing required field name';
        } else if (!student.studentCode) {
          student.status = 'error';
          student.error = 'Missing required field studentCode';
        } else if (!student.className) {
          student.status = 'error';
          student.error = 'Missing required field className';
        }

        students.push(student);
      }

      setParsedStudents(students);
    };
    reader.readAsText(file);
  };

  const handleUpload = () => {
    if (!selectedFile || parsedStudents.length === 0) return;

    const validStudents = parsedStudents.filter((s) => s.status === 'valid');
    onAction({
      file: selectedFile,
      students: validStudents,
      totalCount: parsedStudents.length,
      validCount: validStudents.length
    });
  };

  const downloadSampleFile = () => {
    const sampleCSV = `name,studentCode,className
John Doe,220GA201001,Form 1
Jane Smith,220GA201002,Form 2
Bob Johnson,220GA201003,Form 1`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const validStudents = parsedStudents.filter((s) => s.status === 'valid');
  const errorStudents = parsedStudents.filter((s) => s.status === 'error');

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Register bulk students into the TEMVO POS system.
      </Typography>

      <Alert icon={<InfoCircle size={20} variant="Bold" />} severity="info" sx={{ mb: 3 }}>
        Super Admins can bulk upload students via CSV.{' '}
        <Link component="button" onClick={downloadSampleFile} sx={{ textDecoration: 'underline' }}>
          Download a sample file
        </Link>{' '}
        or choose a file to upload.
      </Alert>

      <Box
        sx={{
          border: '2px dashed',
          borderColor: selectedFile ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          mb: 3,
          backgroundColor: selectedFile ? 'primary.50' : 'grey.50',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50'
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".csv" style={{ display: 'none' }} />
        <DocumentUpload size={48} variant="Bold" color="#2e7d32" style={{ marginBottom: 16 }} />
        <Typography variant="h6" gutterBottom>
          {selectedFile ? selectedFile.name : 'Choose a CSV file'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedFile ? 'Click to select a different file' : 'Click to browse or drag and drop your CSV file here'}
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => fileInputRef.current?.click()}>
          Browse Files
        </Button>
      </Box>

      {loading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Processing students...
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {parsedStudents.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              icon={<TickCircle size={16} variant="Bold" />}
              label={`${validStudents.length} Valid`}
              color="success"
              variant="outlined"
            />
            {errorStudents.length > 0 && (
              <Chip
                icon={<InfoCircle size={16} variant="Bold" />}
                label={`${errorStudents.length} Errors`}
                color="error"
                variant="outlined"
              />
            )}
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>studentCode</TableCell>
                  <TableCell>className</TableCell>
                  <TableCell>Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Chip
                        size="small"
                        label={student.status}
                        color={student.status === 'valid' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.studentCode}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>
                      {student.error && (
                        <Typography variant="caption" color="error">
                          {student.error}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <DialogActions sx={{ px: 0, pt: 2 }}>
        <Button variant="outlined" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || validStudents.length === 0 || loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Enrolling...' : `Enroll ${validStudents.length} Students`}
        </Button>
      </DialogActions>
    </Box>
  );
}
