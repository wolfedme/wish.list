import React, { useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import { CssBaseline } from '@material-ui/core';

import { ThemeProvider } from 'styled-components';

import { useTranslation } from 'react-i18next';

import firebaseConfig from './globals/firebase/config';

import lightTheme from './globals/theme/lightTheme';
import darkTheme from './globals/theme/darkTheme';

import Dashboard from './components/layout/dashboard/Dashboard';
import { TProduct } from './common/TProduct';

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

  const debugProducts: Array<TProduct> = [];
  const debugProduct1: TProduct = {
    id: 1,
    name: 'PRODUCT_NAME',
    description: 'PRODUCT_DESCRIPTION',
    price: 99.9,
    vendor: 'unknown',
    link: '#',
    imgUrl: 'https://source.unsplash.com/random/800x600',
  };
  const debugProduct2: TProduct = {
    id: 2,
    name: 'PRODUCT_NAME',
    description: 'PRODUCT_DESCRIPTION',
    price: 99.9,
    vendor: 'unknown',
    link: '#',
    imgUrl: 'https://source.unsplash.com/random/800x600',
  };

  debugProducts.push(debugProduct1);
  debugProducts.push(debugProduct2);

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <Dashboard products={debugProducts} />
      </ThemeProvider>
    </>
  );
}

export default App;

// TODO: Write tests!
