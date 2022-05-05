'use strict';

describe('Model', ()=>{
    const assert = require('assert');
    let helpers, Model, model, createDbName;
    //const re = (module)=>{ return require('../../' + module); }
    before(()=>{
        const yeap_db = require('yeap_db');
        helpers = yeap_db.postgres.helpers;
        Model = require('../Model');
        createDbName=(name)=>{ return yeap_db.Db.createDbName('yeap_app_server_example_model_') + name };
    });

    after((done)=>{
        model.close(done);
    });

    it('Setup database, create model', (done)=>{
        const dbName = createDbName('main');
        Model.create(dbName, (err, m)=>{
            assert(!err, err);
            assert(m);
            model = m;
            done();
        });
    });

    it('Count empty orders', (done)=>{
        model.orders.count((err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });

    it('List empty orders', (done)=>{
        model.orders.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 0);
            done();
        });
    });

    it('Peek not existing order', (done)=>{
        model.orders.peek('100', (err, element)=>{
            assert(!err);
            assert(!element);
            done();
        });
    });

    it('Add 1 order', (done)=>{
        model.orders.add({name:'Ivan', phone:'1111111'}, (err)=>{
            assert(!err);
            done();
        });
    });

    it('Count orders', (done)=>{
        model.orders.count((err, count)=>{
            assert(!err);
            assert.equal(count, 1);
            done();
        });
    });

    it('List orders', (done)=>{
        model.orders.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 1);
            assert.equal(elements[0].id, 1);
            assert.equal(elements[0].name, 'Ivan');
            assert.equal(elements[0].phone, '1111111');
            done();
        });
    });

    it('Peek existing order', (done)=>{
        model.orders.peek('1', (err, element)=>{
            assert(!err);
            assert(element);
            assert.equal(element.id, 1);
            assert.equal(element.name, 'Ivan');
            assert.equal(element.phone, '1111111');
            done();
        });
    });

    it('Remove 1st recored', (done)=>{
        model.orders.remove(1, (err)=>{
            assert(!err);
            done();
        });
    });

    it('Count empty orders', (done)=>{
        model.orders.count((err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });

    it('List empty orders', (done)=>{
        model.orders.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 0);
            done();
        });
    });

    it('Add 10 more orders', (done)=>{
        const add = (index, count, cb)=>{
            if(index<count) {
                model.orders.add(
                    {
                        name:`SomeName-${index}`,
                        phone:`${index}${index}${index}`
                    },
                    (err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            add(index+1, count, cb);
                        }
                    });
            } else {
                cb();
            }
        }

        add(0, 10, (err)=>{
            assert(!err);
            done();
        });
    });

    it('Count orders', (done)=>{
        model.orders.count((err, count)=>{
            assert(!err);
            assert.equal(count, 10);
            done();
        });
    });

    it('List orders', (done)=>{
        model.orders.list((err, elements)=>{
            assert(!err);
            assert.equal(elements.length, 10);
            for(let i=1; i<10; ++i) {
                const e = elements[i];
                assert.equal(e.id, 2+i);
                assert.equal(e.name, `SomeName-${i}`);
                assert.equal(e.phone, `${i}${i}${i}`);
            }
            done();
        });
    });

    it('Remove 10 records', (done)=>{
        const remove = (index, count, cb)=>{
            if(index<count) {
                const i = 2+index;
                model.orders.remove(i, (err)=>{
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

    it('Count orders', (done)=>{
        model.orders.count((err, count)=>{
            assert(!err);
            assert.equal(count, 0);
            done();
        });
    });
});

