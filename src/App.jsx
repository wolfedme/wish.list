import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import { CssBaseline } from '@material-ui/core';

import { ThemeProvider } from 'styled-components';

import firebaseConfig from './globals/firebase/config';
import headerBar from './components/layout/header';

firebase.initializeApp(firebaseConfig);

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
    </div>
    </ThemeProvider>
  );
}

export default App;

// TODO: Write tests!
