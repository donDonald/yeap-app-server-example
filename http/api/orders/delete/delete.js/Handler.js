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

        const params = req.body;
        const id = params.id;
//      console.log(`${this._logPrefix}.handle, params:`, params);
//      console.log(`${this._logPrefix}.handle, id:`, id);
        delete orders[id];

        res.sendStatus(200);
    }

    return Handler;
}

