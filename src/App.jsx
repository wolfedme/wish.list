import React, { useState, useContext, useEffect } from 'react';
import './App.css';

import { CssBaseline } from '@material-ui/core';

import { ThemeProvider } from 'styled-components';

import { useTranslation } from 'react-i18next';

import lightTheme from './globals/theme/lightTheme';
import darkTheme from './globals/theme/darkTheme';

import Dashboard from './components/pages/dashboard/Dashboard';
import { LoggerContext } from './globals/logger';

function App() {
  // Contexts
  const { t } = useTranslation();
  const log = useContext(LoggerContext); // TODO: Change all console.logs to logger

  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    // Toggle between light & dark theme
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <Dashboard />
      </ThemeProvider>
    </>
  );
}

export default App;

// TODO: Write tests!
