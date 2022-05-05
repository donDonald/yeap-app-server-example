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

        const params = req.body;
        const name = params.name;
        const phone = params.phone;
//      console.log(`${this._logPrefix}.handle, params:`, params);
//      console.log(`${this._logPrefix}.handle, name:${name}`);
//      console.log(`${this._logPrefix}.handle, phone:${phone}`);

        const orders = g_application.model.orders;
        orders.add({name:name, phone:phone}, (err, result)=>{
            if(err) {
                res.status(500);
            } else {
                assert(result);
                res.status(200).json(result);
            }
        });
    }

    return Handler;
}

