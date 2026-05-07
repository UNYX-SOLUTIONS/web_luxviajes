// Simple logger utility
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';

const colors = {
    info: '\x1b[36m',    // cyan
    warn: '\x1b[33m',    // yellow
    error: '\x1b[31m',   // red
    debug: '\x1b[35m',   // magenta
    reset: '\x1b[0m',
};

export const logger = {
    info: (message: string, data?: any) => {
        // console.log(
            `${colors.info}[INFO]${colors.reset} ${message}`,
            data ? JSON.stringify(data) : ''
        );
    },

    warn: (message: string, data?: any) => {
        console.warn(
            `${colors.warn}[WARN]${colors.reset} ${message}`,
            data ? JSON.stringify(data) : ''
        );
    },

    error: (message: string, error?: Error | any) => {
        console.error(
            `${colors.error}[ERROR]${colors.reset} ${message}`,
            error ? (error instanceof Error ? error.message : JSON.stringify(error)) : ''
        );
    },

    debug: (message: string, data?: any) => {
        if (isDevelopment) {
            console.debug(
                `${colors.debug}[DEBUG]${colors.reset} ${message}`,
                data ? JSON.stringify(data) : ''
            );
        }
    },
};
