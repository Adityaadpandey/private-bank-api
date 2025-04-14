import chalk from 'chalk';
import winston from 'winston';
import { config } from '.';

// Define custom colors for different parts of the log
const colors = {
    timestamp: chalk.cyan,
    level: {
        error: chalk.red.bold,
        warn: chalk.yellow.bold,
        info: chalk.green.bold,
        http: chalk.magenta.bold,
        verbose: chalk.blue.bold,
        debug: chalk.white.bold,
        silly: chalk.gray.bold
    },
    service: chalk.cyan.bold,
    message: chalk.white
};

// Define interface for log info object
interface LogInfo {
    timestamp: string;
    level: string;
    message: string;
    service: string;
    [key: string]: any;
}

const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    defaultMeta: { service: config.SERVICE_NAME },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info: any) => {
            const levelColor = colors.level[info.level as keyof typeof colors.level] || colors.level.info;

            return `${colors.timestamp(`[${info.timestamp}]`)} ${levelColor(`[${info.level}]`)} ${colors.service(`[${info.service}]`)}: ${colors.message(info.message)}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

// Add colors to Winston's internal level configuration
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'blue',
    debug: 'white',
    silly: 'gray'
});

export default logger;
