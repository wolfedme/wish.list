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

  public getUser() {
    const uid = this.provider.auth.currentUser?.uid;
    return uid ? uid : 'none';
  }

  public async getProductsOnce(): Promise<Product[]> {
    this.log.debug(`getProductsOnce() at path ${this.fullPath}`);
    return this.provider.db
      .ref(this.fullPath)
      .once('value')
      .then((value) => {
        const arr: Product[] = [];
        value.forEach((x) => {
          arr.push(x.val());
        });
        this.log.debug(`Found ${arr.length} products: `, arr);
        return Promise.resolve(arr);
      })
      .catch((err: app.FirebaseError) => {
        this.log.error(err.message);
        return Promise.reject(err);
      });
  }

  public fetchProductReference(id: number): app.database.Reference {
    this.log.debug(`fetchReference(${id}) at path ${this.fullPath}${id}`);
    return this.provider.db.ref(`${this.fullPath}${id}/`);
  }

  public fetchWholeReference(): app.database.Reference {
    this.log.debug(`fetchReference for products at ${this.fullPath}`);
    return this.provider.db.ref(`${this.fullPath}`);
  }

  public updateItem(data: Product) {
    this.log.warn('TODO: Implement');
  }

  public async addItem(data: Product): Promise<Product> {
    // TODO: Validate
    if (!data) {
      this.log.debug('addItem() called with empty product');
      return Promise.reject({ message: 'Product empty' });
    }

    this.log.debug(`addItem(${data}) called`);

    // Validate
    // typeof etc.

    const toPush = data;
    toPush.id = new Date().getTime();
    const pushRef = this.provider.db.ref(this.fullPath + toPush.id + '/');
    return await pushRef
      .set(toPush)
      .then((_) => {
        this.log.debug(`Pushed product with generated id ${toPush.id}`);
        return Promise.resolve(toPush);
      })
      .catch((x: Error) => {
        this.log.error({ message: `Error while pushing: ${x.message}` });
        return Promise.reject(x);
      });
  }

  public removeItem(id: number) {
    this.log.warn('TODO: Implement');
  }

  public removeBulk(ids: number[]) {
    this.log.warn('TODO: Implement');
  }
}

export default FirebaseService.getInstance();
