import 'firebase/auth';
import 'firebase/database';

import app from 'firebase/app';
import config from './FirebaseConfig';
import jsLogger from 'js-logger';

import { ListItem } from '../../types/data/listItemType';
import { firebaseProvider } from '../../types/services/firebaseConfigType';
import configs from '../configuration/configurations';

class FirebaseService {
  // Singleton
  private static classInstance?: FirebaseService;
  static getInstance(): FirebaseService {
    return this.classInstance ?? new FirebaseService();
  }

  log = jsLogger.get('FirebaseService');
  static initialized = false;

  provider: firebaseProvider;

  constructor() {
    //Ensure only one Service gets init
    if (FirebaseService.initialized && app.apps.length) {
      this.log.debug('Multiple instances of Firebase Service called.');

      this.provider = {
        app: app.app(),
        db: app.database(),
        auth: app.auth(),
        authState: 'none',
      };

      return;
    }

    app.initializeApp(config);

    this.provider = {
      app: app.app(),
      db: app.database(),
      auth: app.auth(),
      authState: 'none',
    };

    this.log.debug('Firebase Service initialised.');
    FirebaseService.initialized = true;

    configs.firebase.auto_anonymous_signin && this.signInAnonymously();

    FirebaseService.classInstance = this;
  }

  async signInAnonymously() {
    // Check if user is already authenticated
    const currentUser = this.provider.auth.currentUser;
    this.log.debug({ currentUser });
    if (currentUser) {
      this.log.debug('Already signed in, skipping function');
      return 0;
    }

    // Sign in anonymously
    await this.provider.auth
      .signInAnonymously()
      .then(() => {
        this.provider.auth.onAuthStateChanged((user) => {
          user && this.log.debug(`User with id '${user.uid}' signed in anonymously`);
          user && (this.provider.authState = 'anon');
        });
      })
      .catch((err: app.FirebaseError) => {
        this.log.debug(`Error while signing in: ${err.code}`);
        this.log.error(`${err.message}`);
        return 0;
      });

    return 1;
  }

  public signInUser() {
    this.log.warn('TODO: Implement');
  }

  // TODO: Realtime listener for reservation changes
  public async getProductsOnce(): Promise<ListItem[]> {
    return this.provider.db
      .ref('products/')
      .once('value')
      .then((value) => {
        return value.val().filter((x: ListItem) => x !== null);
      })
      .catch((err: app.FirebaseError) => {
        this.log.error(err.message);
      });
  }

  public fetchReference(id: number): app.database.Reference {
    return this.provider.db.ref(`/products/${id}/`);
  }

  public updateItems(ids: number[]) {
    this.log.warn('TODO: Implement');
  }

  public addItem(data: ListItem) {
    this.log.warn('TODO: Implement');
  }

  public removeItem(id: number) {
    this.log.warn('TODO: Implement');
  }

  public removeBulk(ids: number[]) {
    this.log.warn('TODO: Implement');
  }
}

export default FirebaseService.getInstance();
