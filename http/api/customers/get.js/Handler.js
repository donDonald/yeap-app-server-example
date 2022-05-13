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

        const container = g_application.model.customers;
        let result;
        let code = 200;

        const cid = req.query.cid;
        if (cid) {
            container.peek(cid, (err, e)=>{
                if (err) {
                    code = 500;
                } else {
                    result = e;
                    if(!result) code = 204;
                }
                res.status(code).json(result);
            });
        } else {
            container.list((err, elements)=>{
                if (err) {
                    code = 500;
                } else {
                    result = {};
                    result.totalCount = elements.length;
                    result.customers = elements;
                    if(!result) code = 204;
                }
                res.status(code).json(result);
            });
        }

    }

    return Handler;
}

