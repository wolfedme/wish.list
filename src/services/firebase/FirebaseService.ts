import 'firebase/auth';
import 'firebase/database';

import app from 'firebase/app';
import config from './FirebaseConfig';
import jsLogger from 'js-logger';
import { firebaseProvider } from 'types/services/firebaseConfigType';
import * as convars from 'configs/convars.json';
import { Product } from 'types/data/productType';

class FirebaseService {
  private static log = jsLogger.get('FirebaseService');
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
    };

    FirebaseService.log.debug('Firebase Service initialized.');
    FirebaseService.initialized = true;

    convars.firebase.auto_anonymous_signin && this.signInAnonymously();

    FirebaseService.classInstance = this;
  }

  async signInAnonymously() {
    // Check if user is already authenticated
    const currentUser = this.provider.auth.currentUser;
    FirebaseService.log.debug({ currentUser });
    if (currentUser) {
      FirebaseService.log.debug('Already signed in, skipping function');
      return 0;
    }

    // Sign in anonymously
    await this.provider.auth
      .signInAnonymously()
      .then(() => {
        this.provider.auth.onAuthStateChanged((user) => {
          user && FirebaseService.log.debug(`User with id '${user.uid}' signed in anonymously`);
        });
      })
      .catch((err: app.FirebaseError) => {
        FirebaseService.log.debug(`Error while signing in: ${err.code}`);
        FirebaseService.log.error(`${err.message}`);
        return 0;
      });

    return 1;
  }

  public signInUser() {
    FirebaseService.log.warn('TODO: Implement');
  }

  public getUser() {
    // TODO: Reduce calls and store uid in variable
    const uid = this.provider.auth.currentUser?.uid;
    return uid ? uid : 'none';
  }

  public async getProductsOnce(): Promise<Product[]> {
    FirebaseService.log.debug(`getProductsOnce() at path ${this.fullPath}`);
    return this.provider.db
      .ref(this.fullPath)
      .once('value')
      .then((value) => {
        const arr: Product[] = [];
        value.forEach((x) => {
          arr.push(x.val());
        });
        FirebaseService.log.debug(`Found ${arr.length} products: `, arr);
        return Promise.resolve(arr);
      })
      .catch((err: app.FirebaseError) => {
        FirebaseService.log.error(err.message);
        return Promise.reject(err);
      });
  }

  public fetchProductReference(id: number): app.database.Reference {
    FirebaseService.log.debug(`fetchReference(${id}) at path ${this.fullPath}${id}`);
    return this.provider.db.ref(`${this.fullPath}${id}/`);
  }

  public fetchWholeReference(): app.database.Reference {
    FirebaseService.log.debug(`fetchReference for products at ${this.fullPath}`);
    return this.provider.db.ref(`${this.fullPath}`);
  }

  public updateItem(data: Product) {
    FirebaseService.log.warn('TODO: Implement');
  }

  public async toggleReserve(data: Product): Promise<Product> {
    const dbData = this.provider.db.ref(`${this.fullPath}/${data.id}`);
    const dbObject: Product = (await dbData.once('value')).val();

    //TODO: Delete reservedBy

    if (data.isReserved !== dbObject.isReserved) {
      return Promise.reject(
        new Error('Cannot toggle, product isReserved differs from database state'),
      );
    }

    if (data.isReserved && data.reservedBy && data.reservedBy !== this.getUser()) {
      return Promise.reject(
        new Error("Cannot undo reserve, product's ReservedBy differs from current UserID"),
      );
    }

    const updatedProduct = { ...data };
    updatedProduct.isReserved = !updatedProduct.isReserved;

    if (!data.isReserved) {
      updatedProduct.reservedBy = this.getUser();
    }

    if (data.isReserved) {
      updatedProduct.reservedBy && delete updatedProduct.reservedBy;
    }

    return dbData
      .set(updatedProduct)
      .then((x) => {
        return Promise.resolve(x);
      })
      .catch((x) => {
        return Promise.reject(x);
      });
  }

  public async addItem(data: Product): Promise<Product> {
    // TODO: Validate
    if (!data) {
      FirebaseService.log.error('addItem() called with empty product');
      return Promise.reject({ message: 'Product empty' });
    }

    FirebaseService.log.debug('addItem() with data: ', data);

    // Validate
    // typeof etc.

    const toPush = data;
    toPush.id = new Date().getTime();
    const pushRef = this.provider.db.ref(this.fullPath + toPush.id + '/');
    return await pushRef
      .set(toPush)
      .then((_) => {
        FirebaseService.log.debug(`Pushed product with generated id ${toPush.id}`);
        return Promise.resolve(toPush);
      })
      .catch((x: Error) => {
        FirebaseService.log.error({ message: `Error while pushing: ${x.message}` });
        return Promise.reject(x);
      });
  }

  public removeItem(id: number) {
    FirebaseService.log.warn('TODO: Implement');
  }

  public removeBulk(ids: number[]) {
    FirebaseService.log.warn('TODO: Implement');
  }
}

export default FirebaseService.getInstance();
