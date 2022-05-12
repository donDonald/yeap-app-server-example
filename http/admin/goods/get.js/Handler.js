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

        const keys = Object.keys(g_application.model.constructor.Goods.dbKeys);
        const ts = keys.indexOf('ts');
        if (ts > -1) {
            keys.splice(ts, 1);
        }

        const opts = {
            name:'goods',
            itemName:'good',
            itemId:'gid',
            urls: {
                list:'/api/goods',
                add:'/api/goods/add',
                delete:'/api/goods/delete'
            }
        };

        const template = {};
        template.templateKeys = keys;
        template.templateOpts = opts;
        res.render('elements', template);
    }

    return Handler;
}

