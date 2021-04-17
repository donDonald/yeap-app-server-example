'use strict';

const assert = require('assert');

module.exports = function (api) {
    assert(api);

    const Handler = function(opts) {
        assert(opts.route);
        assert(opts.method);
        this.route = opts.route;
        this.method = opts.method;
        this._logPrefix = `${this.method}${this.route}`;
    }

    Handler.prototype.handle = function(req, res, next) {
//      console.log(`${this._logPrefix}.handle()`);

        const orders = req.app.zzz.model.orders;
        let result = orders;
        let code = 200;

        const id = req.query.id;
        if (id) {
            result = orders[id];
            if (!result) {
                code = 204;
            }
        } else {
            result = orders;
        }

        res.status(code).json(result);
    }

    return Handler;
}

