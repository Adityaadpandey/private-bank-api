import { getLogger } from "@private-bank/logger";
import { config } from ".";

const logger = getLogger(config.SERVICE_NAME, config.LOG_LEVEL);

export default logger;
