'use strict';

const assert = require('assert');
const yeap_db = require('yeap_db');
const helpers = yeap_db.postgres.helpers;
const Customers = require('./Customers');
const Goods = require('./Goods');
const Orders = require('./Orders');




class Model {

    static create(dbName, cb) {
        let _dbName, _cb;
        if(typeof dbName == 'string') {
            assert.equal(typeof cb, 'function');
            _dbName = dbName;
            _cb = cb;
        } else if(typeof dbName == 'function') {
            _cb = dbName;
            _dbName = Model.collectDbName();
        } else {
            assert(false, 'Incorrct set of parameters');
        }
        Model.createDatabase(_dbName, (err)=>{
            if (err) {
                _cb(err);
            } else {
                helpers.connect(_dbName, (err, db)=>{
                    if (err) {
                        _cb(err);
                    } else {
                        assert(db);
                        const model = new Model(db);
                        _cb(undefined, model);
                    }
                });
            }
        });
    }

    static createDatabase(dbName, cb) {
        const quieries = [];
        const customers = require('../config/schema/customers');
        quieries.push(customers);
        const goods = require('../config/schema/goods');
        quieries.push(goods);
        const orders = require('../config/schema/orders');
        quieries.push(orders);
        const orders_goods = require('../config/schema/orders_goods');
        quieries.push(orders_goods);
        helpers.createAndQuery(dbName, quieries, (err)=>{
            cb(err);
        });
    }

    static collectDbName() {
        const databases = Object.entries(require('../config/databases.js'));
        const dbProps = databases[0][1];
        return dbProps.database;
    }

    constructor(dbc) {
        assert(dbc);
        this._dbc = dbc;
        this._customers = new Customers(this._dbc);
        this._goods = new Goods(this._dbc);
        this._orders = new Orders(this._dbc);
        //this._orders_goods = new OrdersGoods(this._dbc);
    }

    close(cb) {
        assert(cb);
        const dbc = this._dbc;
        this._dbc = 'undefined';
        if(dbc) {
            dbc.close(cb);
        } else {
            setImmediate(cb);
        }
    }

    get customers() {
        return this._customers;
    }

    get goods() {
        return this._goods;
    }

    get orders() {
        return this._orders;
    }

    get orders_goods() {
        return this._orders_goods;
    }
}

module.exports = Model;
