'use strict';

const assert = require('assert');
const yeap_db = require('yeap_db');
const helpers = yeap_db.postgres.helpers;




// Database Good record
let Record = function (props) {
    if (props.gid) this.gid = props.gid;
    if (props.name) this.name = props.name;
    this.amount = props.amount;
    if (props.ts) this.ts = props.ts;
}

// \brief These keys are mant for mapping JS fileds to DB fields.
//        Postgresql doesn't support camel-case notation.
Record.dbKeys = {};
Record.dbKeys.gid = 'gid';
Record.dbKeys.name = 'name';
Record.dbKeys.amount = 'amount';
Record.dbKeys.ts = 'ts';
Record.dbKeysArray = Object.values(Record.dbKeys);




class Goods {
    constructor(dbc) {
        assert(dbc);
        this._dbc = dbc;
        this._count = yeap_db.model.count.bind(undefined, this._dbc, 'goods');
        const inserter = function(values, value)
        {
            if (!values) {
                return [];
            }
            values.push(value);
            return values;
        }
        this._run = yeap_db.model.query.run.bind(undefined, this._dbc, 'goods', Record, inserter);
        //this._add = yeap_db.model.add.bind(undefined, this._dbc, 'goods', Record);
        this._delete = yeap_db.model.delete.bind(undefined, this._dbc, 'goods', 'gid');
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
        assert(record.gid);
        assert(record.name);
        const q = `INSERT INTO goods (gid, name) VALUES ('${record.gid}', '${record.name}') RETURNING gid, name, amount, ts`;
        this._dbc.query(q, [], (err, result)=>{
            if(err) {
                cb(err);
            } else {
                const value = new Record(result.rows[0]);
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
        const opts = {
            keys: Record.dbKeysArray,
            where:{}
        };
        opts.where[Record.dbKeys.gid] = id;
        this._run(opts, (err, elements)=>{
            if(err) {
                cb(err);
            } else {
                const e = elements.length == 1 ? elements[0] : undefined;
                cb(err, e);
            }
        });
    }

    //
    // \brief Get amount of goods for gived gid
    //
    countAmount(gid, cb) {
        const q = `SELECT amount FROM goods WHERE gid = '${gid}'`;
        this._dbc.query(q, [], (err, result)=>{
            if(err) {
                cb(err);
            } else {
                let amount = 0;
                if (result.rowCount != 0) {
                    amount = result.rows[0].amount
                }
                cb(err, amount);
            }
        });
    }

    //
    // \brief Add some amount of goods for gived gid. Negative amount means removal while positive means adding.
    //
    addSomeAmount(gid, amount, cb) {
        this._dbc.transaction.begin((err)=>{
            if(err) {
                cb(err);
            } else {
                const q = `UPDATE goods SET amount = amount + ${amount} WHERE gid = '${gid}' RETURNING amount`;
                this._dbc.query(q, [], (err, result)=>{
                    if(this._dbc.transaction.shouldAbort(err, cb)) return;
                    const amount2 = result.rows[0].amount;
                    if (amount2 > 0) {
                        // Positive amount means adding
                        this._dbc.transaction.commit(cb, amount2);
                    } else {
                        // Neagative amount means removal
                        this._dbc.transaction.shouldAbort(`New amount turns to be negative, requested:${amount}, new:${amount2}`, (err)=>{
                            cb(err, amount2);
                        });
                    }
                });
            }
        });
    }

    //
    // \brief Reset amount of goods to 0 for gived gid.
    //
    resetAmount(gid, cb) {
        const q = `UPDATE goods SET amount = 0 WHERE gid = '${gid}' RETURNING amount`;
        this._dbc.query(q, [], (err, result)=>{
            if(err) {
                cb(err);
            } else {
                cb(err, result.rows[0].amount);
            }
        });
    }

}

module.exports = Goods;
