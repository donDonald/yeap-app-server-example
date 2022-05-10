'use strict';

describe('Goods', ()=>{
    const assert = require('assert');
    let helpers, Model, Goods, goods, dbc, createDbName;
    before(()=>{
        const yeap_db = require('yeap_db');
        helpers = yeap_db.postgres.helpers;
        Goods = require('../Goods');
        Model = require('../Model');
        createDbName=(name)=>{ return yeap_db.Db.createDbName('yeap_app_server_example_goods_') + name };
    });

    after((done)=>{
        dbc.close(done);
    });

    it('Setup database, create model', (done)=>{
        const dbName = createDbName('main');
        Model.createDatabase(dbName, (err)=>{
            assert(!err, err);
            helpers.connect(dbName, (err, db)=>{
                assert(!err, err);
                assert(db);
                dbc = db;
                goods = new Goods(dbc);
                done();
            });
        });
    });

    it('Count empty records', (done)=>{
        goods.count((err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });

    it('List empty records', (done)=>{
        goods.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 0);
            done();
        });
    });

    it('Peek not existing record', (done)=>{
        goods.peek('100', (err, element)=>{
            assert(!err);
            assert(!element);
            done();
        });
    });

    it('Count amount of not existing record', (done)=>{
        goods.countAmount('100', (err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });

    it('Create 1 record', (done)=>{
        goods.create({gid:'A0001', name:'Washing Machine'}, (err, result)=>{
            assert(!err);
            assert(result);
            assert.equal(result.gid, 'A0001');
            assert.equal(result.name, 'Washing Machine');
            assert.equal(result.amount, 0);
            assert(result.ts);
            done();
        });
    });

    it('Count records', (done)=>{
        goods.count((err, count)=>{
            assert(!err);
            assert.equal(count, 1);
            done();
        });
    });

    it('List records', (done)=>{
        goods.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 1);
            assert.equal(elements[0].gid, 'A0001');
            assert.equal(elements[0].name, 'Washing Machine');
            assert.equal(elements[0].amount, 0);
            assert(elements[0].ts);
            done();
        });
    });

    it('Peek existing record', (done)=>{
        goods.peek('A0001', (err, element)=>{
            assert(!err);
            assert(element);
            assert.equal(element.gid, 'A0001');
            assert.equal(element.name, 'Washing Machine');
            assert.equal(element.amount, 0);
            assert(element.ts);
            done();
        });
    });

    it('Count amount of A0001', (done)=>{
        goods.countAmount('A0001', (err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });

    it('Remove some amount of A0001', (done)=>{
        goods.addSomeAmount('A0001', -10, (err, count)=>{
            assert(err);
            assert.equal(err, 'New amount turns to be negative, requested:-10, new:-10');
            assert.equal(count, -10);
            done();
        });
    });

    it('Add some amount of A0001', (done)=>{
        goods.addSomeAmount('A0001', 3, (err, count)=>{
            assert(!err);
            assert.equal(count, 3);
            done();
        });
    });

    it('Remove some amount of A0001', (done)=>{
        goods.addSomeAmount('A0001', -2, (err, count)=>{
            assert(!err);
            assert.equal(count, 1);
            done();
        });
    });

    it('Reset amount of A0001', (done)=>{
        goods.resetAmount('A0001', (err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });

    it('Remove 1st recored', (done)=>{
        goods.remove('A0001', (err)=>{
            assert(!err);
            done();
        });
    });

    it('Count empty records', (done)=>{
        goods.count((err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });

    it('List empty records', (done)=>{
        goods.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 0);
            done();
        });
    });

    it('Create 10 records', (done)=>{
        const create = (index, count, cb)=>{
            if(index<count) {
                goods.create(
                    {
                        gid:`A000${index}`,
                        name:`SomeName-${index}`,
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
        goods.count((err, count)=>{
            assert(!err);
            assert.equal(count, 10);
            done();
        });
    });

    it('List records', (done)=>{
        goods.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 10);
            for(let i=1; i<10; ++i) {
                const e = elements[i];
                assert.equal(e.gid, `A000${i}`);
                assert.equal(e.name, `SomeName-${i}`);
                assert.equal(e.amount, 0);
                assert(e.ts);
            }
            done();
        });
    });

    it('Remove 10 records', (done)=>{
        const remove = (index, count, cb)=>{
            if(index<count) {
                goods.remove(`A000${index}`, (err)=>{
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
        goods.count((err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });

});

