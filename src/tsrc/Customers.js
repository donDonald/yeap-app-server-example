'use strict';

describe('Customers', ()=>{
    const assert = require('assert');
    let helpers, Model, Customers, customers, dbc, createDbName;
    before(()=>{
        const yeap_db = require('yeap_db');
        helpers = yeap_db.postgres.helpers;
        Customers = require('../Customers');
        Model = require('../Model');
        createDbName=(name)=>{ return yeap_db.Db.createDbName('yeap_app_server_example_customers_') + name };
    });

    after((done)=>{
        dbc.close(done);
    });

    it('Check Customers.dbKeys', ()=>{
        assert.equal(typeof Customers.dbKeys, 'object');
        assert.equal(Object.keys(Customers.dbKeys).length, 4);
        assert.equal(Customers.dbKeys.cid, 'cid');
        assert.equal(Customers.dbKeys.name, 'name');
        assert.equal(Customers.dbKeys.phone, 'phone');
        assert.equal(Customers.dbKeys.ts, 'ts');
    });

    it('Setup database, create model', (done)=>{
        const dbName = createDbName('main');
        Model.createDatabase(helpers.DB_CRIDENTIALS, dbName, (err)=>{
            assert(!err, err);
            helpers.connect(helpers.DB_CRIDENTIALS, dbName, (err, db)=>{
                assert(!err, err);
                assert(db);
                dbc = db;
                customers = new Customers(dbc);
                done();
            });
        });
    });

    it('Count empty records', (done)=>{
        customers.count((err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });

    it('List empty records', (done)=>{
        customers.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 0);
            done();
        });
    });

    it('Peek not existing record', (done)=>{
        customers.peek('100', (err, element)=>{
            assert(!err);
            assert(!element);
            done();
        });
    });

    it('Create 1 record', (done)=>{
        customers.create({name:'Ivan', phone:'1111111'}, (err, result)=>{
            assert(!err);
            assert(result);
            assert(result.cid);
            assert.equal(result.name, 'Ivan');
            assert.equal(result.phone, '1111111');
            assert(result.ts);
            done();
        });
    });

    it('Count records', (done)=>{
        customers.count((err, count)=>{
            assert(!err);
            assert.equal(count, 1);
            done();
        });
    });

    it('List records', (done)=>{
        customers.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 1);
            assert(elements[0].cid);
            assert.equal(elements[0].name, 'Ivan');
            assert.equal(elements[0].phone, '1111111');
            assert(elements[0].ts);
            done();
        });
    });

    it('Peek existing record', (done)=>{
        customers.peek('1', (err, element)=>{
            assert(!err);
            assert(element);
            assert(element.cid);
            assert.equal(element.name, 'Ivan');
            assert.equal(element.phone, '1111111');
            assert(element.ts);
            done();
        });
    });

    it('Remove 1st recored', (done)=>{
        customers.remove(1, (err)=>{
            assert(!err);
            done();
        });
    });

    it('Count empty records', (done)=>{
        customers.count((err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });

    it('List empty records', (done)=>{
        customers.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 0);
            done();
        });
    });

    it('Create 10 records', (done)=>{
        const create = (index, count, cb)=>{
            if(index<count) {
                customers.create(
                    {
                        name:`SomeName-${index}`,
                        phone:`${index}${index}${index}`
                    },
                    (err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            create(index+1, count, cb);
                        }
                    });
            } else {
                cb();
            }
        }

        create(0, 10, (err)=>{
            assert(!err);
            done();
        });
    });

    it('Count records', (done)=>{
        customers.count((err, count)=>{
            assert(!err);
            assert.equal(count, 10);
            done();
        });
    });

    it('List records', (done)=>{
        customers.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 10);
            for(let i=1; i<10; ++i) {
                const e = elements[i];
                assert(e.cid);
                assert.equal(e.name, `SomeName-${i}`);
                assert.equal(e.phone, `${i}${i}${i}`);
                assert(e.ts);
            }
            done();
        });
    });

    it('Remove 10 records', (done)=>{
        const remove = (index, count, cb)=>{
            if(index<count) {
                const i = 2+index;
                customers.remove(i, (err)=>{
                    if(err) {
                        cb(err);
                    } else {
                        remove(index+1, count, cb);
                    }
                });
            } else {
                cb();
            }
        }

        remove(0, 10, (err)=>{
            assert(!err);
            done();
        });
    });

    it('Count records', (done)=>{
        customers.count((err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });
});

