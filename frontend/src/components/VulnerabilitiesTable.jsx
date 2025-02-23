import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'error';
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const VulnerabilitiesTable = ({ vulnerabilities }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Vulnerability Name</TableCell>
            <TableCell>Severity</TableCell>
            <TableCell>Risk Description</TableCell>
            <TableCell>Affected URLs</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vulnerabilities.map((vuln) => (
            <TableRow key={vuln.id}>
              <TableCell>{vuln.id}</TableCell>
              <TableCell>{vuln.name}</TableCell>
              <TableCell>
                <Chip
                  label={vuln.severity}
                  color={getSeverityColor(vuln.severity)}
                  size="small"
                />
              </TableCell>
              <TableCell>{vuln.risk_description}</TableCell>
              <TableCell>{vuln.affected_urls}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VulnerabilitiesTable;