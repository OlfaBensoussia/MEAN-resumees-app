import { createLogger, format, transports, addColors, config } from 'winston';
import path from 'path';
import DailyRotateFile = require('winston-daily-rotate-file');

// const { printf } = format;

const stackTrace = require('stack-trace');

// ----------------------------------------------------------------------
//  Niveaux de messages
// ----------------------------------------------------------------------
const myLevels: config.AbstractConfigSetLevels = {
  error: 0,
  warn: 1,
  supe: 2, // Pour les messages (Compteurs, alarmes,... ) vers la supervision
  info: 3,
  perf: 4,
  debug2: 5,
  debug1: 6,
  debug: 7
};

// ----------------------------------------------------------------------
//    Variables d'environnement
// ----------------------------------------------------------------------
//    NODE_ENV=production     imperatif en production
//    NODE_LOG_PERF=perf      Retablit les logs de base (sans l'origine du message de log)
//
//    NODE_LOG_LEVEL          Niveau de log pour la log fichier
//    NODE_LOG_CONSOLE_LEVEL  Niveau de log pour la log console
//    NODE_LOG_CONSOLE=off    Inhibe la log console
//                     =on    Active la log console
// ----------------------------------------------------------------------

// Niveau de trace sortie fichier :
//    Par defaut, valeur a utiliser en prod : supe
const logLevel = process.env.NODE_LOG_LEVEL ? process.env.NODE_LOG_LEVEL : 'supe';

// Niveau de trace sortie console :
//    Par defaut, tout :  debug
const consoleLevel = process.env.NODE_LOG_CONSOLE_LEVEL ? process.env.NODE_LOG_CONSOLE_LEVEL : 'debug';

// ----------------------------------------------------------------------
//  Couleurs associées aux niveaux de messages :
//   - la restitution des couleurs dépend aussi du paramétrage de la console
// ----------------------------------------------------------------------
const myCustomLevels = {
  myLevels,
  colors: {
    error: 'red',
    warn: 'magenta',
    supe: 'blue',
    info: 'bold magenta',
    perf: 'yellow',
    debug2: 'green',
    debug1: 'cyan',
    debug: 'bold green'
  }
};
addColors(myCustomLevels.colors);

// ----------------------------------------------------------------------
//  Fonctions utilisables pour specifier le format de sortie des logs
/* ----------------------------------------------------------------------
format.json(),          \
format.logstash(),       |  Fonctions
format.prettyPrint(),    |  standard
format.simple(),        /
format.printf(),        => permet de definir un format personalisé
// ---------------------------------------------------------------------- */

// ----------------------------------------------------------------------
//   Trace avec nom de fichier source, fonction et numero de ligne
//
export function trace (level?: string, message?: string, ...rest: any) {
  // Produire des Traces avec nom de fichier, nom de fonction et numero de ligne.
  // est tres couteux en temps
  // NODE_LOG_PERF=perf      Retablit les logs de base (sans l'origine du message de log)
  if (process.env.NODE_LOG_PERF === 'perf') {
    logger.log(level, message, rest);
  } else {
    const frame = stackTrace.get()[1];
    // const file = path.basename(frame.getFileName());
    // const line = frame.getLineNumber();
    // const method = frame.getFunctionName();
    // logger.log(level, file + ':' + line + ' ' + method + '() : ' + message, rest);
    logger.log(level, path.basename(frame.getFileName()) + ':' + frame.getLineNumber() + ' ' + frame.getFunctionName() + '() : ' + message, rest);
  }
}

// ========================================================================
//   Creation du logger
// ========================================================================
const logDir = './logs/';

const logger = createLogger({
  levels: myCustomLevels.myLevels,

  format: format.combine(
    // format timestamp compatible avec elasticsearch
    format.timestamp({
      format: 'YYYY-MM-DDTHH:mm:ss.SSS'
    }),
    format.splat()
  )
});

// ----------------------------------------------------------------------
//   Sortie fichier
// ----------------------------------------------------------------------
// Le parametre 'level' permet de moduler le niveau de traces
//   level: 'error'  : Que les erreurs
//   level: 'debug'  : Toutes les traces
//   level: 'info'   : Toutes les traces de niveau supérieur à 'info'
//   etc...
// ----------------------------------------------------------------------
logger.add(new DailyRotateFile({
  filename: `${logDir}traces.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: false,
  maxSize: '100m', // k: kilo, m: mega, g: giga-bytes
  maxFiles: '15d', // d: days, f: files
  level: logLevel,
  format: format.combine(
    format.logstash() // json(), logstash()
  )
}));

// ----------------------------------------------------------------------
//   Sortie console
// ----------------------------------------------------------------------
// const myFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} ${level}: ${message}`;
// });

// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
if (process.env.NODE_ENV !== 'production') {
  if (process.env.NODE_LOG_CONSOLE !== 'off') {
    logger.add(new transports.Console({
      level: consoleLevel,
      format: format.combine(
        // format.logstash(),
        // format.json(),
        format.prettyPrint(),
        //  'colorize' APRES les lignes logstash(), json() ou prettyPrint()
        //             AVANT les lignes simple() ou myFormat.
        format.colorize({ all: true }),
        format.simple()
        // myFormat
      )
    }));
  }
} else {
  if (process.env.NODE_LOG_CONSOLE === 'on') {
    logger.add(new transports.Console({
      level: consoleLevel,
      format: format.combine(
        format.prettyPrint(),
        format.colorize({ all: true }),
        format.simple()
      )
    }));
  }
}
export default logger;

// ########################################################################
//          Exemples d'utilsation des logs
//          (Decommmenter pour voir le resultat)
/* ########################################################################
        // ***********************
        // Allows for JSON logging
        // ***********************
        logger.log({
          level: 'info',
          message: 'Pass an object and this works',
          additional: 'properties',
          are: 'passed along'
        });

        logger.info({
          message: 'Use a helper method if you want',
          additional: 'properties',
          are: 'passed along'
        });

        // ***********************************
        // Allows for parameter-based logging
        // ***********************************

        logger.log('info', 'Pass a message and this works', {
          additional: 'properties',
          are: 'passed along'
        });

        logger.info('Use a helper method if you want', {
          additional: 'properties',
          are: 'passed along'
        });

        // *******************************
        //  Pass an object
        // *******************************
        logger.log('debug2', 'Le coupable est ', {nom:  'Paul', prenom: 'Hochon'});
        const myObject = {
          nom:  'Paul',
          prenom: 'Hochon'
        };
        logger.log('debug2', 'Le coupable est ', myObject);

        // *******************************
        // Allows for string interpolation
        // *******************************

        // info: test message my string {}
        logger.log('info', 'test message %s', 'my string');

        // info: test message my 123 {}
        logger.log('info', 'test message %d', 123);

        // info: test message first second {number: 123}
        logger.log('info', 'test message %s, %s', 'first', 'second', { number: 123 });

        // prints 'Found error at %s'
        const Nb1 = 100.01;
        const Nb2 = 200;
        logger.info('Found %s. %s at %s', 'error', 'Tests Ko', new Date());
        logger.info('Found %s. %s at %s', 'error', 'Tests Ko', new Error('chill winston'));
        logger.info('Found %s. %s at %s', 'error', 'Tests Ko', /WUT/);
        logger.info('Found %s. %s at %s', 'error', 'Tests Ko', true);
        logger.info('Found %s. %s at %s', 'error', 'Tests Ko', 100.00);
        logger.info('Found %s. %s at %s', 'error', 'Tests Ko', ['1, 2, 3']);

        logger.debug('Found %s. %s at %s', 'error', 'Tests Ko', new Date());
        logger.debug('Found %s. %s at %s', 'error', 'Tests Ko', new Error('chill winston'));
        logger.debug('Found %s. %s at %s', 'error', 'Tests Ko', /WUT/);
        logger.debug('Found %s. %s at %s', 'error', 'Tests Ko', true);
        logger.debug('Found %s. %s at %s', 'error', 'Tests Ko', 100.00);
        logger.log('debug1', 'Found %s  %d > %d', 'error', 150, 100.00);
        logger.debug('Found %s. %s at %s', 'error', 'Tests Ko', ['1, 2, 3']);

        logger.log('debug1', 'Found %s. %s at %s', 'error', 'Tests Ko', new Date());
        logger.log('debug1', 'Found %s. %s at %s', 'error', 'Tests Ko', new Error('chill winston'));
        logger.log('debug1', 'Found %s. %s at %s', 'error', 'Tests Ko', /WUT/);
        logger.log('debug1', 'Found %s. %s at %s', 'error', 'Tests Ko', true);
        logger.log('debug1', 'Found %s  %s at %s', 'error', 'Tests Ko', 100.02);
        logger.log('debug1', 'Found %s  %d > %d', 'error', Nb2, Nb1);
        logger.log('debug1', 'Found %s. %s at %s', 'error', 'Tests Ko', ['1, 2, 3']);

        logger.log('debug2', 'Found %s. %s at %s', 'error', 'Tests Ko', new Date());
        logger.log('debug2', 'Found %s. %s at %s', 'error', 'Tests Ko', new Error('chill winston'));
        logger.log('debug2', 'Found %s. %s at %s', 'error', 'Tests Ko', /WUT/);
        logger.log('debug2', 'Found %s. %s at %s', 'error', 'Tests Ko', true);
        logger.log('debug2', 'Found %s. %s at %s', 'error', 'Tests Ko', 100.40);
        logger.log('debug1', 'Found %s  %d > %d', 'error', 300, 100.00);
        logger.log('debug2', 'Found %s. %s at %s', 'error', 'Tests Ko', ['1, 2, 3']);

        // ***********************************
        // Allows for logging Error instances
        // ***********************************
        logger.warn(new Error('Error passed as info'));
        //logger.log('error', new Error('Error passed as message'));

        logger.warn('Maybe important error: ', new Error('Error passed as meta'));
        logger.log('error', 'Important error: ', new Error('Error passed as meta'));

        logger.error(new Error('Error as info'));
        */
