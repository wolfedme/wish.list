import 'firebase/auth';
import 'firebase/database';

import app from 'firebase/app';
import config from './FirebaseConfig';
import jsLogger from 'js-logger';
import { firebaseProvider } from 'types/services/firebaseConfigType';
import * as convars from 'configs/convars.json';
import { Product } from 'types/data/productType';

class FirebaseService {
  log = jsLogger.get('FirebaseService');
  // Singleton
  private static classInstance?: FirebaseService;

  private basePath = convars.firebase.basePath;
  private productsPath = convars.firebase.productsPath;
  private fullPath = this.basePath + this.productsPath;

  static getInstance(): FirebaseService {
    return this.classInstance ?? new FirebaseService();
  }

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

    !app.apps.length && app.initializeApp(config);

    this.provider = {
      app: app.app(),
      db: app.database(),
      auth: app.auth(),
      authState: 'none',
    };

    this.log.debug('Firebase Service initialized.');
    FirebaseService.initialized = true;

    convars.firebase.auto_anonymous_signin && this.signInAnonymously();

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

  public async getProductsOnce(): Promise<Product[]> {
    this.log.debug(`getProductsOnce() at path ${this.fullPath}`);
    return this.provider.db
      .ref(this.fullPath)
      .once('value')
      .then((value) => {
        const val = value.val();
        return val ? val.filter((x: Product) => x !== null) : [];
      })
      .catch((err: app.FirebaseError) => {
        this.log.error(err.message);
      });
  }

  public fetchReference(id: number): app.database.Reference {
    this.log.debug(`fetchReference(${id}) at path ${this.fullPath}${id}`);
    return this.provider.db.ref(`${this.fullPath}${id}/`);
  }

  public updateItem(data: Product) {
    this.log.warn('TODO: Implement');
  }

  public addItem(data: Product) {
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
