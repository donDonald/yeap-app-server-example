'use strict';

module.exports = {
    writeIntervalMs: 3000, // 3 secs
    writeBufferBytes: 64 * 1024, // Buffer size 64kb
    streams: ['system', 'fatal', 'error', 'warn', 'info', 'debug', 'access']
}

