'use strict';

describe('Model', ()=>{
    const assert = require('assert');
    let helpers, Model, model, createDbName, addStuff;
    before(()=>{
        const yeap_db = require('yeap_db');
        helpers = yeap_db.postgres.helpers;
        Model = require('../Model');
        createDbName=(name)=>{ return yeap_db.Db.createDbName('yeap_app_server_example_model_') + name };
    });

    before((done)=>{
        const dbName = createDbName('main');
        addStuff = (Ctor, addFoo, index, count, cb)=>{
            if(index<count) {
                const value = Ctor(index);
                addFoo(
                    value,
                    (err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            addStuff(Ctor, addFoo, index+1, count, cb);
                        }
                    });
            } else {
                cb();
            }
        }
        Model.create(helpers.DB_CRIDENTIALS, dbName, (err, m)=>{
            assert(!err, err);
            assert(m);
            model = m;
            done();
        });
    });

    after((done)=>{
        model.close(done);
    });




    describe('Customers basics', ()=>{
        it('Check Model.Customers', ()=>{
            assert.equal(typeof Model.Customers, 'function');
        });

        it('Count empty customers', (done)=>{
            model.customers.count((err, count)=>{
                assert(!err);
                assert.equal(count, 0);
                done();
            });
        });

        it('List empty customers', (done)=>{
            model.customers.list((err, customers)=>{
                assert(!err);
                assert.equal(customers.length, 0);
                done();
            });
        });

        it('Peek not existing customer', (done)=>{
            model.customers.peek('100', (err, customer)=>{
                assert(!err);
                assert(!customer);
                done();
            });
        });

        it('Add 5 customers', (done)=>{
            const ctor = (index)=>{
                return {name:`SomeName-${index}`, phone:`00000${index}`};
            }
            const add = (v, cb)=>{
                model.customers.create(v, cb);
            }
            addStuff(ctor, add, 0, 5, ()=>{
                done();
            });
        });

        it('Count customers', (done)=>{
            model.customers.count((err, count)=>{
                assert(!err);
                assert.equal(count, 5);
                done();
            });
        });

        it('List customers', (done)=>{
            model.customers.list((err, customers)=>{
                assert(!err);
                assert.equal(customers.length, 5);
                done();
            });
        });
    });




    describe('Goods basics', ()=>{
        it('Check Model.Goods', ()=>{
            assert.equal(typeof Model.Goods, 'function');
        });

        it('Count empty goods', (done)=>{
            model.goods.count((err, count)=>{
                assert(!err);
                assert.equal(count, 0);
                done();
            });
        });

        it('List empty goods', (done)=>{
            model.goods.list((err, goods)=>{
                assert(!err);
                assert.equal(goods.length, 0);
                done();
            });
        });

        it('Peek not existing good', (done)=>{
            model.goods.peek('100', (err, good)=>{
                assert(!err);
                assert(!good);
                done();
            });
        });

        it('Add 5 goods', (done)=>{
            const ctor = (index)=>{
                return {name:`SuperGood-${index}`, gid:`A000${index}`, amount:0};
            }
            const add = (v, cb)=>{
                model.goods.create(v, cb);
            }
            addStuff(ctor, add, 0, 10, ()=>{
                done();
            });
        });

        it('Count goods', (done)=>{
            model.goods.count((err, count)=>{
                assert(!err);
                assert.equal(count, 10);
                done();
            });
        });

        it('List goods', (done)=>{
            model.goods.list((err, goods)=>{
                assert(!err);
                assert.equal(goods.length, 10);
                done();
            });
        });
    });




    describe('Orders basics', ()=>{
        it('Check Model.Orders', ()=>{
            assert.equal(typeof Model.Orders, 'function');
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

        it('Add 3 orders', (done)=>{
            const ctor = (index)=>{
                return {cid:1+index};
            }
            const add = (v, cb)=>{
                model.orders.create(v, cb);
            }
            addStuff(ctor, add, 0, 3, ()=>{
                done();
            });
        });

        it('Count orders', (done)=>{
            model.orders.count((err, count)=>{
                assert(!err);
                assert.equal(count, 3);
                done();
            });
        });

        it('List orders', (done)=>{
            model.orders.list((err, elements)=>{
                assert(!err);
                assert.equal(elements.length, 3);
                done();
            });
        });
    });
});

