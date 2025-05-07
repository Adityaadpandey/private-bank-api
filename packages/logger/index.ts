import chalk from 'chalk';
import winston from 'winston';

const levelStyles: Record<string, any> = {
    error: chalk.bgRed.white.bold,
    warn: chalk.bgYellow.black.bold,
    info: chalk.bgGreen.black.bold,
    http: chalk.bgMagenta.white.bold,
    verbose: chalk.bgBlue.white,
    debug: chalk.bgWhite.black,
    silly: chalk.bgGray.white,
};

export const getLogger = (service: string, level = 'debug') => {
    return winston.createLogger({
        level: level,
        defaultMeta: { service },
        format: winston.format.combine(
            winston.format.timestamp({ format: 'HH:mm:ss' }),
            winston.format.printf((info) => {
                const style = levelStyles[info.level] || chalk.bgCyan.black;
                const tag = style(` ${info.level.toUpperCase()} `);
                const time = chalk.dim(`[${info.timestamp}]`);
                const serviceName = chalk.cyan(`[${service}]`);
                const message = chalk.white(info.message);

                return `${time} ${tag} ${serviceName}: ${message}`;
            }),
        ),
        transports: [new winston.transports.Console()],
    });
};

winston.addColors({
    error: 'red bold',
    warn: 'yellow bold',
    info: 'green bold',
    http: 'magenta bold',
    verbose: 'blue bold',
    debug: 'white bold',
    silly: 'gray bold',
});
