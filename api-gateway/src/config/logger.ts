import winston from "winston";
import { config } from ".";

// Map log levels to emojis and colors
const levelEmojiMap: Record<string, string> = {
    error: "❌",
    warn: "⚠️",
    info: "ℹ️",
    http: "🌐",
    verbose: "🔍",
    debug: "🐞",
    silly: "🎉",
};

const customFormat = winston.format.printf(({ timestamp, level, message, service }) => {
    const emoji = levelEmojiMap[level] || "🔧";
    return [
        `\x1b[36m[${timestamp}]\x1b[0m`, // Cyan timestamp
        `\x1b[1m${emoji}\x1b[0m`,        // Bold emoji
        `\x1b[1;33m${level.toUpperCase()}\x1b[0m`, // Bright Yellow log level
        `\x1b[35m${service}\x1b[0m`, // Magenta service
        `: \x1b[32m${message}\x1b[0m\n` // Green message with indent
    ].join(" ");
});

const logger = winston.createLogger({
    level: config.LOG_LEVEL || "info",
    defaultMeta: { service: config.SERVICE_NAME || "my-app" },
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
    ),
    transports: [new winston.transports.Console()],
});

export default logger;
