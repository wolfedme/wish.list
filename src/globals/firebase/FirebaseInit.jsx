import app from 'firebase/app';

import Logger from '../logger';

import 'firebase/auth';
import 'firebase/database';

// TODO: Add to Readme - create .env file

const prodConfig = {
  apiKey: process.env.REACT_APP_PROD_API_KEY,
  authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
  projectId: process.env.REACT_APP_PROD_PROJECT_ID,
  storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_PROD_APP_ID,
};

const devConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
  projectId: process.env.REACT_APP_DEV_PROJECT_ID,
  storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_DEV_APP_ID,
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.db = app.database();
    this.auth = app.auth();
    this.authState = 'none';

    this.log = new Logger().log;
  }

  signInAnonymously() {
    // Check if user is already authenticated
    const { currentUser } = this.auth;
    this.log.debug({ currentUser });
    if (currentUser) {
      this.log.debug('DEBUG Already signed in, skipping function');
      return 0;
    }

    // Sign in anonymously
    this.auth
      .signInAnonymously()
      .then(({ user }) => {
        this.log.debug(`DEBUG user with id '${user.uid}' signed in anonymously`);
        this.authState = 'anon';
      })
      .catch((err) => {
        this.log.debug(`DEBUG error while signing in: ${err.code}`);
        this.log.error(`ERROR ${err.message}`);
      });

    return 1;
  }
}

export default Firebase;
