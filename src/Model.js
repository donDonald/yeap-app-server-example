'use strict';

const assert = require('assert');
const yeap_db = require('yeap_db');
const helpers = yeap_db.postgres.helpers;
assert(yeap_db.model.add);

// Database Order record
let Order = function (props) {
    if (props.id) this.id = props.id;
    if (props.ts) this.ts = props.ts;
    if (props.name) this.name = props.name;
    if (props.phone) this.phone = props.phone;
}

// \brief These keys are mant for mapping JS fileds to DB fields.
//        Postgresql doesn't support camel-case notation.
Order.dbKeys = {};
Order.dbKeys.id = 'id';
Order.dbKeys.ts = 'ts';
Order.dbKeys.name = 'name';
Order.dbKeys.phone = 'phone';
Order.dbKeysArray = Object.values(Order.dbKeys);




class Orders {
    constructor(dbc) {
        assert(dbc);
        this._dbc = dbc;
        this._count = yeap_db.model.count.bind(undefined, this._dbc, 'orders');
        const inserter = function(values, value)
        {
            if (!values) {
                return [];
            }
            values.push(value);
            return values;
        }
        this._run = yeap_db.model.query.run.bind(undefined, this._dbc, 'orders', Order, inserter);
        //this._add = yeap_db.model.add.bind(undefined, this._dbc, 'orders', Order);
        this._delete = yeap_db.model.delete.bind(undefined, this._dbc, 'orders', 'id');
    }

    count(record, cb) {
        this._count(record, (err, count)=>{
            cb(err, count);
        });
    }

    list(cb) {
        const opts = {
            keys: [Order.dbKeys.id, Order.dbKeys.name, Order.dbKeys.phone]
        };
        this._run(opts, (err, elements)=>{
            cb(err, elements);
        });
    }

    peek(id, cb) {
        const opts = {
            //keys: [Order.dbKeys.id, Order.dbKeys.name, Order.dbKeys.phone],
            keys: Order.dbKeysArray,
            //keys: [Order.dbKeys.id, Order.dbKeys.name, Order.dbKeys.phone, Order.dbKeys.ts],
            where:{}
        };
        opts.where[Order.dbKeys.id] = id;
        this._run(opts, (err, elements)=>{
            if(err) {
                cb(err);
            } else {
                const e = elements.length == 1 ? elements[0] : undefined;
                cb(err, e);
            }
        });
    }

    add(record, cb) {
        assert(record.name);
        assert(record.phone);
        const q = `INSERT INTO orders (name, phone) VALUES ('${record.name}', '${record.phone}') RETURNING id, name, phone, ts`;
        this._dbc.query(q, [], (err, result)=>{
            if(err) {
                cb(err);
            } else {
                cb(err, result.rows[0]);
            }
        });
    }

    remove(id, cb) {
        this._delete(id, (err)=>{
            cb(err);
        });
    }
}




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
console.log('Model.create, 1');
        Model.createDatabase(_dbName, (err)=>{
console.log('Model.create, 2');
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
        const orders = require('../config/schema/orders');
        quieries.push(orders);
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
        this._orders = new Orders(this._dbc);
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

    get orders() {
        return this._orders;
    }
}

module.exports = Model;
