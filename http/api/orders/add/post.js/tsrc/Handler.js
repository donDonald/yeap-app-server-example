'use strict';

describe('yeap_app_server_example.http.api.orders.add.post.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Post;
    let helpers, Model, createDbName;
    let addCustomers;
    before(()=>{
        api = require('yeap_app_server');
        Router = api.dev_tools.express.Router;
        Response = api.dev_tools.express.Response;
        Post = api.dev_tools.express.Post;
        helpers = api.db.postgres.helpers;
        Model = require('../../../../../../src/Model');
        createDbName=(name)=>{ return api.db.Db.createDbName('http_api_orders_add_post_') + name };
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
        process.env.YEAP_APP_SERVER_ROOT = __dirname + '/../../../../../../';
    });

    after(()=>{
        process.env.YEAP_APP_SERVER_ROOT = undefined;
    });

    let router, method, model;
    describe('Setup', ()=>{
        it('Create method', ()=>{
            const ROUTE = '/api/orders/add';
            const METHOD = 'POST';
            router = new Router();
            method = api.app_server.routerHelper.createHandler(router, 'http/api/orders/add/post.js');
            assert.equal(method.route, ROUTE);
            assert.equal(method.method, METHOD);
            Post = Post.bind(undefined, (req)=>{
            });
        });
    });

    describe('Main cases', (done)=>{
        before((done)=>{
            assert(!global.g_application);
            global.g_application = {};
            Model.create(helpers.DB_CRIDENTIALS, createDbName('main'), (err, m)=>{
                model = m;
                g_application.model = model;
                done();
            });
        });

        after((done)=>{
            global.g_application = undefined;
            model.close(done);
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

        it('Create order 0', (done)=>{
            const req = new Post(
                {
                    cid:customers[0].cid,
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const order = res.result.value;
                assert.equal(3, Object.keys(order).length);
                assert(order.oid);
                assert.equal(order.cid, customers[0].cid);
                assert(order.ts);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 1);
                    model.orders.peek(order.oid, (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.oid, order.oid);
                        assert.equal(e.cid, order.cid);
                        assert(e.ts);
                        assert(e.goods);
                        assert.equal(Object.keys(e.goods).length, 0);
                        done();
                    });
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create order 1', (done)=>{
            const req = new Post(
                {
                    cid:customers[1].cid,
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const order = res.result.value;
                assert.equal(3, Object.keys(order).length);
                assert(order.oid);
                assert.equal(order.cid, customers[1].cid);
                assert(order.ts);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 2);
                    model.orders.peek(order.oid, (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.oid, order.oid);
                        assert.equal(e.cid, order.cid);
                        assert(e.ts);
                        assert(e.goods);
                        assert.equal(Object.keys(e.goods).length, 0);
                        done();
                    });
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create order 2', (done)=>{
            const req = new Post(
                {
                    cid:customers[2].cid,
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const order = res.result.value;
                assert.equal(3, Object.keys(order).length);
                assert(order.oid);
                assert.equal(order.cid, customers[2].cid);
                assert(order.ts);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 3);
                    model.orders.peek(order.oid, (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.oid, order.oid);
                        assert.equal(e.cid, order.cid);
                        assert(e.ts);
                        assert(e.goods);
                        assert.equal(Object.keys(e.goods).length, 0);
                        done();
                    });
                });
            });

            router.handle(method.route, req, res, router.next);        
        });
    });

    describe('Error cases', (done)=>{
        before((done)=>{
            assert(!global.g_application);
            global.g_application = {};
            Model.create(helpers.DB_CRIDENTIALS, createDbName('errors'), (err, m)=>{
                model = m;
                g_application.model = model;
                done();
            });
        });

        after((done)=>{
            global.g_application = undefined;
            model.close(done);
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

        it('Create an order, missing cid field', (done)=>{
            const req = new Post(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(400, res.result.code);
                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 0);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create proper order now', (done)=>{
            const req = new Post(
                {
                    cid:customers[0].cid,
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 1);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });
    });
});

