'use strict';

describe('http.api.orders.get.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Get;
    let helpers, Model, createDbName;
    let addOrders;
    before(()=>{
        api = require('yeap_app_server');
        Router = api.lib.express.Router;
        Response = api.lib.express.Response;
        Get = api.lib.express.Get;
        const yeap_db = require('yeap_db');
        helpers = yeap_db.postgres.helpers;
        Model = require('../../../../../src/Model');
        createDbName=(name)=>{ return yeap_db.Db.createDbName('http_api_orders_get_') + name };
        addOrders = (index, count, cb)=>{
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
                            addOrders(index+1, count, cb);
                        }
                    });
            } else {
                cb();
            }
        }
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

        it('Add 1 record', (done)=>{
            addOrders(0, 1, (err)=>{
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

                const orders = res.result.value;
                assert.equal(1, Object.keys(orders).length);
                assert.equal(orders[0].id, '1');
                assert.equal(orders[0].name, 'SomeName-0');
                assert.equal(orders[0].phone, '000');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Add 5 records', (done)=>{
            addOrders(1, 6, (err)=>{
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

                const orders = res.result.value;
                assert.equal(1+5, Object.keys(orders).length);
                assert.equal(orders[0].id, '1');
                assert.equal(orders[0].name, 'SomeName-0');
                assert.equal(orders[0].phone, '000');
                    assert.equal(orders[1].id, '2');
                    assert.equal(orders[1].name, 'SomeName-1');
                    assert.equal(orders[1].phone, '111');
                assert.equal(orders[2].id, '3');
                assert.equal(orders[2].name, 'SomeName-2');
                assert.equal(orders[2].phone, '222');
                    assert.equal(orders[3].id, '4');
                    assert.equal(orders[3].name, 'SomeName-3');
                    assert.equal(orders[3].phone, '333');
                assert.equal(orders[4].id, '5');
                assert.equal(orders[4].name, 'SomeName-4');
                assert.equal(orders[4].phone, '444');
                    assert.equal(orders[5].id, '6');
                    assert.equal(orders[5].name, 'SomeName-5');
                    assert.equal(orders[5].phone, '555');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Collecting order by id', (done)=>{
            const req = new Get(
                {
                    id:'1'
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const order = res.result.value;
                assert.equal(order.name, 'SomeName-0');
                assert.equal(order.phone, '000');
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
                    id:'1000'
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

