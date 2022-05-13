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

        const keys = Object.keys(g_application.model.constructor.Orders.dbKeys);
        const ts = keys.indexOf('ts');
        if (ts > -1) {
            keys.splice(ts, 1);
        }
        const oid = keys.indexOf('oid');
        if (oid > -1) {
            keys.splice(oid, 1);
        }

        const opts = {
            name:'orders',
            itemName:'order',
            itemId:'oid',
            urls: {
                list:'/api/orders',
                add:'/api/orders/add',
                delete:'/api/orders/delete'
            }
        };

        const template = {};
        template.templateKeys = keys;
        template.templateOpts = opts;
        res.render('elements', template);
    }

    return Handler;
}

