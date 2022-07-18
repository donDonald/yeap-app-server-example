'use strict';

const assert = require('assert');
const yeap_db = require('yeap_db');
const helpers = yeap_db.postgres.helpers;




// Database Order record
let Record = function (props) {
    if (props.oid) this.oid = `${props.oid}`;
    if (props.cid) this.cid = `${props.cid}`;
    if (props.ts) this.ts = props.ts;
}

// \brief These keys are mant for mapping JS fileds to DB fields.
//        Postgresql doesn't support camel-case notation.
Record.dbKeys = {};
Record.dbKeys.oid = 'oid';
Record.dbKeys.cid = 'cid';
Record.dbKeys.ts = 'ts';
Record.dbKeysArray = Object.values(Record.dbKeys);




class Orders {

    static dbKeys = Record.dbKeys;

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
        this._run = yeap_db.model.query.run.bind(undefined, this._dbc, 'orders', Record, inserter);
        //this._add = yeap_db.model.add.bind(undefined, this._dbc, 'orders', Record);
        this._delete = yeap_db.model.delete.bind(undefined, this._dbc, 'orders', 'oid');
    }

    count(record, cb) {
        this._count(record, (err, count)=>{
            cb(err, count);
        });
    }

    list(cb) {
        const opts = {
            keys: Record.dbKeysArray,
        };
        this._run(opts, (err, elements)=>{
            cb(err, elements);
        });
    }

    create(record, cb) {
        assert(record.cid);
        const q = `INSERT INTO orders (cid) VALUES ('${record.cid}') RETURNING oid, cid, ts`;
        this._dbc.query(q, [], (err, result)=>{
            if(err) {
                cb(err);
            } else {
                const value = new Record(result[0]);
                cb(err, value);
            }
        });
    }

    remove(id, cb) {
        this._delete(id, (err)=>{
            cb(err);
        });
    }

    peek(id, cb) {
        let q = `SELECT oid, cid, ts FROM orders WHERE oid='${id}'`;
        this._dbc.query(q, [], (err, result)=>{
//          console.log('AAAAAAAAA ----------------------');
//          console.dir(result);
//          console.log('----------------------');
            if(err) {
                cb(err);
            } else {
                if(result.length == 0) {
                    cb(err, undefined);
                } else {
                    const order = result[0];
                    order.goods = {};
                    q=`SELECT orders_goods.oid, orders.ts, orders_goods.gid, orders_goods.amount, goods.name FROM orders_goods LEFT JOIN goods ON orders_goods.gid=goods.gid LEFT JOIN orders ON orders.oid=orders_goods.oid WHERE orders_goods.oid='${id}'`;
                    this._dbc.query(q, [], (err, result)=>{
                        //console.log('peek() >>>>>>>>>>>>>>>>>>>>>>');
                        //console.dir(result);
                        //console.log('<<<<<<<<<<<<<<<<<<<<<<');
                        if(err) {
                            cb(err);
                        } else {
                            if (result.length) {
                                for(let i=0; i<result.length; ++i) {
                                    const r = result[i];
                                    order.goods[r.gid] = {gid:r.gid, name:r.name, amount:r.amount};
                                }
                            }
                            cb(undefined, order);
                        }
                    });
                }
            }
        });
    }

    peekByCustomer(cid, cb) {
        let q = `SELECT oid, cid, ts FROM orders WHERE cid='${cid}'`;
        this._dbc.query(q, [], (err, result)=>{
          //console.log('peekByCustomer() >>>>>>>>>>>>>>>>>>>>>>');
          //console.dir(result);
          //console.log('<<<<<<<<<<<<<<<<<<<<<<');
            if(err) {
                cb(err);
            } else {
                let orders;
                for(let i=0; i<result.length; ++i) {
                    orders = orders || {};
                    const order = result[i];
                    order.goods = {};
                    orders[order.oid] = order;
                }

                const q=`SELECT orders_goods.oid, orders.ts, orders.cid, orders_goods.gid, orders_goods.amount, goods.name FROM orders_goods LEFT JOIN goods ON orders_goods.gid=goods.gid LEFT JOIN orders ON orders.oid=orders_goods.oid WHERE orders.cid='${cid}'`;
                this._dbc.query(q, [], (err, result)=>{
                  //console.log('peekByCustomer() >>>>>>>>>>>>>>>>>>>>>>');
                  //console.dir(result);
                  //console.log('<<<<<<<<<<<<<<<<<<<<<<');
                    if(err) {
                        cb(err);
                    } else {
                        for(let i=0; i<result.length; ++i) {
                            const r = result[i];
                            const order = orders[r.oid];
                            //order.goods = order.goods || {};
                            order.goods[r.gid] = {gid:r.gid, name:r.name, amount:r.amount};
                        }
                        cb(undefined, orders);
                    }
                });
            }
        });
    }

    addGood(oid, gid, goodAmount, cb) {
        this._dbc.transaction.begin((err)=>{
            if(err) {
                cb(err);
            } else {
                let q = `UPDATE goods SET amount = amount - ${goodAmount} WHERE gid = '${gid}' RETURNING amount`;
                this._dbc.query(q, [], (err, result)=>{
                    if(this._dbc.transaction.shouldAbort(err, cb)) return;
                    const amountLeft = result[0].amount;
                    if(amountLeft < 0) {
                       this._dbc.transaction.shouldAbort(`Not enough amount of good, requested:${goodAmount}, left:${amountLeft+goodAmount}`, (err)=>{
                           cb(err);
                       });
                    } else {
                        q = `INSERT INTO orders_goods (oid, gid, amount) VALUES ('${oid}', '${gid}', ${goodAmount}) RETURNING oid, gid, amount, ts`;
                        this._dbc.query(q, [], (err, result)=>{
                            if(this._dbc.transaction.shouldAbort(err, cb)) return;
                            this._dbc.transaction.commit(cb);
                        });
                    }
                });
            }
        });
    }
}

module.exports = Orders;
