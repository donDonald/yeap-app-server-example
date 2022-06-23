'use strict';

describe('http.api.orders.get.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Get;
    let helpers, Model, createDbName;
    let addOrders, addCustomers;
    before(()=>{
        api = require('yeap_app_server');
        Router = api.express.Router;
        Response = api.express.Response;
        Get = api.express.Get;
        helpers = api.db.postgres.helpers;
        Model = require('../../../../../src/Model');
        createDbName=(name)=>{ return api.db.Db.createDbName('http_api_orders_get_') + name };
        addCustomers = (index, count, cb)=>{
            if(index<count) {
                model.customers.create(
                    {
                        name:`SomeName-${index}`,
                        phone:`${index}${index}${index}`
                    },
                    (err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            addCustomers(index+1, count, cb);
                        }
                    });
            } else {
                cb();
            }
        }
        addOrders = (getCidFoo, index, count, cb)=>{
            if(index<count) {
                model.orders.create(
                    {
                        cid:getCidFoo(index),
                    },
                    (err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            addOrders(getCidFoo, index+1, count, cb);
                        }
                    });
            } else {
                cb();
            }
        }
        process.env.APP_ROOT = __dirname + '/../../../../../';
    });

    after(()=>{
        process.env.APP_ROOT = undefined;
    });

    let router, method, model;
    describe('Setup', ()=>{
        it('Create method', ()=>{
            const ROUTE = '/api/orders';
            const METHOD = 'GET';
            router = new Router();
            method = api.app_server.routerHelper.createHandler(router, 'http/api/orders/get.js');
            assert.equal(method.route, ROUTE);
            assert.equal(method.method, METHOD);
            Get = Get.bind(undefined, (req)=>{
            });
        });
    });

    describe('Main cases', (done)=>{
        before((done)=>{
            assert(!global.g_application);
            global.g_application = {};
            Model.create(createDbName('main'), (err, m)=>{
                model = m;
                g_application.model = model;
                done();
            });
        });

        after((done)=>{
            global.g_application = undefined;
            model.close(done);
        });

        it('Collecting empty model', (done)=>{
            const req = new Get(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 0);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        let customers;
        it('Create 10 customers', (done)=>{
            addCustomers(0, 10, (err)=>{
                assert(!err);
                model.customers.list((err, elements)=>{
                    assert(!err);
                    customers = elements;
                  //console.log('customers:'); console.dir(customers);
                    done();
                });
            })
        });

        it('Add 1 record', (done)=>{
            const getCid = (index)=>{
                return customers[index].cid;
            }
            addOrders(getCid, 0, 1, (err)=>{
                assert(!err);
                model.orders.count((err, count)=>{
                    assert(!err);
                    assert.equal(count, 1);
                    done();
                });
            })
        });

        it('Collecting orders with 1 record', (done)=>{
            const req = new Get(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const orders = res.result.value.orders;
                assert.equal(1, Object.keys(orders).length);
                assert.equal(orders[0].oid, 1);
                assert.equal(orders[0].cid, customers[0].cid);
                assert(orders[0].ts);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Add 5 records', (done)=>{
            const getCid = (index)=>{
                return customers[index].cid;
            }
            addOrders(getCid, 1, 6, (err)=>{
                assert(!err);
                model.orders.count((err, count)=>{
                    assert(!err);
                    assert.equal(count, 1+5);
                    done();
                });
            })
        });

        it('Collecting orders with 6 record', (done)=>{
            const req = new Get(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const orders = res.result.value.orders;
                assert.equal(1+5, Object.keys(orders).length);
                assert.equal(orders[0].oid, '1');
                assert.equal(orders[0].cid, customers[0].cid);
                    assert.equal(orders[1].oid, '2');
                    assert.equal(orders[1].cid, customers[1].cid);
                assert.equal(orders[2].oid, '3');
                assert.equal(orders[2].cid, customers[2].cid);
                    assert.equal(orders[3].oid, '4');
                    assert.equal(orders[3].cid, customers[3].cid);
                assert.equal(orders[4].oid, '5');
                assert.equal(orders[4].cid, customers[4].cid);
                    assert.equal(orders[5].oid, '6');
                    assert.equal(orders[5].cid, customers[5].cid);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Collecting order by id', (done)=>{
            const req = new Get(
                {
                    oid:'1'
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const order = res.result.value;
                assert.equal(order.oid, 1);
                assert.equal(order.cid, 1);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });
    });

    describe('Error cases', (done)=>{
        before((done)=>{
            assert(!global.g_application);
            global.g_application = {};
            Model.create(createDbName('errors'), (err, m)=>{
                model = m;
                g_application.model = model;
                done();
            });
        });

        after((done)=>{
            global.g_application = undefined;
            model.close(done);
        });

        it('Collecting order by missing id', (done)=>{
            const req = new Get(
                {
                    oid:'1000'
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(204, res.result.code);
                assert(!res.result.value);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });
    });
});

