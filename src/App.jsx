import React, { useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import { CssBaseline } from '@material-ui/core';

import { ThemeProvider } from 'styled-components';

import { useTranslation } from 'react-i18next';

import firebaseConfig from './globals/firebase/config';
import HeaderBar from './components/layout/HeaderBar';

import lightTheme from './globals/theme/lightTheme';
import darkTheme from './globals/theme/darkTheme';

firebase.initializeApp(firebaseConfig);

function App() {
  // I18N
  const { t } = useTranslation();

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
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <HeaderBar title={t('appTitle')} />
    </ThemeProvider>
  );
}

export default App;

// TODO: Write tests!
