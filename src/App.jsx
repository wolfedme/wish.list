import React, { useState, useContext, useEffect } from 'react';
import './App.css';

import { CssBaseline } from '@material-ui/core';

import { ThemeProvider } from 'styled-components';

import lightTheme from './globals/theme/lightTheme';
import darkTheme from './globals/theme/darkTheme';

import Dashboard from './components/pages/dashboard/Dashboard';
import { FirebaseContext } from './globals/firebase';

function App() {
  // Contexts
  // const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  // const log = useContext(LoggerContext); // TODO: Change all console.logs to logger

  // TODO: Make Theme a global variable (maybe assigned to a user)
  const [theme, setTheme] = useState('light');
  // eslint-disable-next-line no-unused-vars
  const toggleTheme = () => {
    // Toggle between light & dark theme
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    firebase.signInAnonymously(); // TODO: To promise
  }, [firebase.auth.currentUser]);

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
