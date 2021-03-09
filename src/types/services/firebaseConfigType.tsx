import app from 'firebase/app';

export interface firebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  databaseURL: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
}

export interface firebaseProvider {
  app: app.app.App;
  db: app.database.Database;
  auth: app.auth.Auth;
  authState: 'none' | 'anon' | 'admin';
}
