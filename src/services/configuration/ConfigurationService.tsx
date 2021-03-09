import jsLogger from 'js-logger';

export default class ConfigurationService {
  static initialize(): void {
    this.initLogger();
  }

  static initLogger(): void {
    jsLogger.useDefaults();
    process.env.NODE_ENV === 'development'
      ? jsLogger.setLevel(jsLogger.DEBUG)
      : jsLogger.setLevel(jsLogger.ERROR);

    jsLogger.get('configurationService').debug('Logger initialized');
  }
}
