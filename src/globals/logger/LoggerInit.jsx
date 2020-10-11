import * as loglevel from 'loglevel';

class Logger {
  constructor() {
    const level = process.env.NODE_ENV === 'production' ? 'ERROR' : 'DEBUG';

    loglevel.setLevel(level);
    loglevel.debug(`DEBUG Initialized Logger with loglevel ${loglevel.getLevel()}.`);

    this.log = loglevel;
  }
}

export default Logger;
