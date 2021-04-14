'use strict';

module.exports = {

    services: {
        http: {
            port:      3000,
            //key:       'config/ssl/tmp.key',
            //cert:      'config/ssl/tmp.cert',
            session: {
                // Session secret
                // is a string known just at server side to sign session cookie
                secret: 'noway',
                age: 24*60*60*1000, // 1day
            }
        }
    }

}

