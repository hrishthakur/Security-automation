import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ReportUpload from './components/ReportUpload';
import VulnerabilitiesTable from './components/VulnerabilitiesTable';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [vulnerabilities, setVulnerabilities] = useState([]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <ReportUpload />
        <VulnerabilitiesTable vulnerabilities={vulnerabilities} />
      </Container>
    </ThemeProvider>
  );
}

export default App;