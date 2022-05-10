'use strict';

const assert = require('assert');
const yeap_db = require('yeap_db');
const helpers = yeap_db.postgres.helpers;




// Database Customer record
let Record = function (props) {
    if (props.cid) this.cid = `${props.cid}`;
    if (props.name) this.name = props.name;
    if (props.phone) this.phone = props.phone;
    if (props.ts) this.ts = props.ts;
}

// \brief These keys are mant for mapping JS fileds to DB fields.
//        Postgresql doesn't support camel-case notation.
Record.dbKeys = {};
Record.dbKeys.cid = 'cid';
Record.dbKeys.name = 'name';
Record.dbKeys.phone = 'phone';
Record.dbKeys.ts = 'ts';
Record.dbKeysArray = Object.values(Record.dbKeys);




class Customers {
    constructor(dbc) {
        assert(dbc);
        this._dbc = dbc;
        this._count = yeap_db.model.count.bind(undefined, this._dbc, 'customers');
        const inserter = function(values, value)
        {
            if (!values) {
                return [];
            }
            values.push(value);
            return values;
        }
        this._run = yeap_db.model.query.run.bind(undefined, this._dbc, 'customers', Record, inserter);
        //this._add = yeap_db.model.add.bind(undefined, this._dbc, 'customers', Record);
        this._delete = yeap_db.model.delete.bind(undefined, this._dbc, 'customers', 'cid');
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
        assert(record.name);
        assert(record.phone);
        const q = `INSERT INTO customers (name, phone) VALUES ('${record.name}', '${record.phone}') RETURNING cid, name, phone, ts`;
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
        opts.where[Record.dbKeys.cid] = id;
        this._run(opts, (err, elements)=>{
            if(err) {
                cb(err);
            } else {
                const e = elements.length == 1 ? elements[0] : undefined;
                cb(err, e);
            }
        });
    }
}

module.exports = Customers;
