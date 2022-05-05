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

        const orders = g_application.model.orders;
        let result;
        let code = 200;

        const id = req.query.id;
        if (id) {
            orders.peek(id, (err, e)=>{
                if (err) {
                    code = 500;
                } else {
                    result = e;
                    if(!result) code = 204;
                }
                res.status(code).json(result);
            });
        } else {
            orders.list((err, elements)=>{
                if (err) {
                    code = 500;
                } else {
                    result = elements;
                    if(!result) code = 204;
                }
                res.status(code).json(result);
            });
        }

    }

    return Handler;
}

