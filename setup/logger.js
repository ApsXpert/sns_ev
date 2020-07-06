import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

require('winston-daily-rotate-file');
const GelfTransport = require('winston-gelf');

const logDirectory = './logs';

// Create log directory if it does not exist.
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logFile = path.join(logDirectory, 'server-logs');
// Defining custom logging format
const customFormat = format.printf(({
                                        level,
                                        message,
                                        timestamp,
                                    }) => (`${timestamp} ${level}: ${message}`));

const options = {
    gelfPro: {
        fields: {
            env: 'Local',
            facility: 'Node.js',
            //
        },
        adapterName: 'udp', // optional; currently supported "udp", "tcp" and "tcp-tls"; default: udp
        adapterOptions: { // this object is passed to the adapter.connect() method
            host: '192.168.0.121', // optional; default: 127.0.0.1
            port: 12202, // optional; default: 12201
        }
    },
    //  logs error and warning on graylog
    level: 'warn'
};

const gelfTransport = new GelfTransport(options);

// Creating logger object
const logger = createLogger({
    format: format.combine(
        format.colorize(),
        format.label(),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        customFormat,
    ),
    transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
            filename: `${logFile}-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            // level: 'debug',
        }),
        gelfTransport
    ]
});

logger.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('Error while trying to write to graylog2:', error);
});


export default logger;
