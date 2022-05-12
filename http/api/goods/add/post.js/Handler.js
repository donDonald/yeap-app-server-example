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
        const gid = params.gid;
        const name = params.name;
        const amount = parseInt(params.amount);
        if (isNaN(amount)) {
            res.status(400);
            return;
        }

//      console.log(`${this._logPrefix}.handle, params:`, params);
//      console.log(`${this._logPrefix}.handle, gid:${gid}`);
//      console.log(`${this._logPrefix}.handle, name:${name}`);
//      console.log(`${this._logPrefix}.handle, amount:${amount}`);

        const container = g_application.model.goods;
        container.create({gid:gid, name:name, amount:amount}, (err, result)=>{
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

