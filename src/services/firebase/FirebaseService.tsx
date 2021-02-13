import 'firebase/auth';
import 'firebase/database';

import app from 'firebase/app';
import config from './FirebaseConfig';
import Logger from 'js-logger';

import { ListItem } from '../../types/data/listItemType';
import { firebaseProvider } from '../../types/services/firebaseConfigType';

class FirebaseService {
  provider: firebaseProvider = {
    db: null,
    auth: null,
    authState: null,
  };

  log;
  static runningInstances = 0;

  constructor() {
    app.initializeApp(config);

    this.provider.db = app.database();
    this.provider.auth = app.auth();
    this.provider.authState = 'none';

    this.log = Logger.get('FirebaseService');
    this.log.debug('DEBUG Firebase Service initialised.');

    // Ensure that only one service is beeing used
    FirebaseService.runningInstances++;
    if (FirebaseService.runningInstances >= 1)
      this.log.warn(
        `WARN FirebaseService has ${FirebaseService.runningInstances} instances running.`,
      );
  }

  signInAnonymously() {
    // Check if user is already authenticated
    const { currentUser } = this.provider.auth;
    this.log.debug({ currentUser });
    if (currentUser) {
      this.log.debug('DEBUG Already signed in, skipping function');
      return 0;
    }

    // Sign in anonymously
    this.provider.auth
      .signInAnonymously()
      .then((user: any) => {
        this.log.debug(`DEBUG user with id '${user.uid}' signed in anonymously`);
        this.provider.authState = 'anon';
      })
      .catch((err: any) => {
        this.log.debug(`DEBUG error while signing in: ${err.code}`);
        this.log.error(`ERROR ${err.message}`);
        return 0;
      });

    return 1;
  }

  signInUser() {
    this.log.warn('WARN Not implemented yet');
  }

  fetchInitial(ids: number[]) {
    this.log.warn('WARN Not implemented yet');
  }

  updateItems(ids: number[]) {
    this.log.warn('WARN Not implemented yet');
  }

  addItem(data: ListItem) {
    this.log.warn('WARN Not implemented yet');
  }

  removeItem(id: number) {
    this.log.warn('WARN Not implemented yet');
  }

  removeBulk(ids: number[]) {
    this.log.warn('WARN Not implemented yet');
  }
}

export default FirebaseService;
