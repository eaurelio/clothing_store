import { createLogger, transports, format } from 'winston';
import path from 'path';

const logPath = path.join(__dirname, 'files');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(logPath, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logPath, 'combined.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

export default logger;
