import chalk from 'chalk';
import winston from 'winston';
import { config } from '.';

const levelColors: Record<string, any> = {
  error: chalk.bgRed.white.bold,
  warn: chalk.bgYellow.black.bold,
  info: chalk.bgGreen.black.bold,
  http: chalk.bgMagenta.white.bold,
  verbose: chalk.bgBlue.white,
  debug: chalk.bgWhite.black,
  silly: chalk.bgGray.white,
};

const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf((info) => {
      const color = levelColors[info.level] || chalk.bgCyan.black;
      const tag = color(` ${info.level.toUpperCase()} `);
      const time = chalk.gray(`[${info.timestamp}]`);
      const msg = chalk.white(info.message);
      const service = chalk.cyan.bold(
        info.service || config.SERVICE_NAME || 'Account Service',
      );

      return `${time} ${tag} ${service}: ${msg}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

winston.addColors({
  error: 'red bold',
  warn: 'yellow bold',
  info: 'green bold',
  http: 'magenta bold',
  verbose: 'blue bold',
  debug: 'white bold',
  silly: 'gray bold',
});

export default logger;
