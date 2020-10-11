/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { SnackbarProvider } from 'notistack';
import App from './App';
import * as serviceWorker from './serviceWorker';

import Firebase, { FirebaseContext } from './globals/firebase';
import Logger, { LoggerContext } from './globals/logger';
import NotificationManager, { NotificationContext } from './globals/notifications';

import './globals/i18n/i18n';

ReactDOM.render(
  <React.StrictMode>
    <LoggerContext.Provider value={new Logger().log}>
      <NotificationContext.Provider value={new NotificationManager()}>
        <FirebaseContext.Provider value={new Firebase()}>
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </FirebaseContext.Provider>
      </NotificationContext.Provider>
    </LoggerContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
