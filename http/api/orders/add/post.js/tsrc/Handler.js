'use strict';

describe('http.api.orders.add.post.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Post;
    let helpers, Model, createDbName;
    before(()=>{
        api = require('yeap_app_server');
        Router = api.lib.express.Router;
        Response = api.lib.express.Response;
        Post = api.lib.express.Post;
        const yeap_db = require('yeap_db');
        helpers = yeap_db.postgres.helpers;
        Model = require('../../../../../../src/Model');
        createDbName=(name)=>{ return yeap_db.Db.createDbName('http_api_orders_add_post_') + name };
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

        it('Create order 0', (done)=>{
            const req = new Post(
                {
                    name:'userA',
                    phone:'0000000',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const order = res.result.value;
                assert.equal(4, Object.keys(order).length);
                assert(order.id);
                assert.equal(order.name, 'userA');
                assert.equal(order.phone, '0000000');
                assert(order.ts);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 1);
                    model.orders.peek(order.id.toString(), (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.id, order.id);
                        assert.equal(e.name, order.name);
                        assert.equal(e.phone, order.phone);
                        //assert.equal(e.ts, order.ts);
                        done();
                    });
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create order 1', (done)=>{
            const req = new Post(
                {
                    name:'userB',
                    phone:'1111111',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const order = res.result.value;
                assert(order.id);
                assert.equal(4, Object.keys(order).length);
                assert.equal(order.name, 'userB');
                assert.equal(order.phone, '1111111');
                assert(order.ts);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 2);
                    model.orders.peek(order.id.toString(), (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.id, order.id);
                        assert.equal(e.name, order.name);
                        assert.equal(e.phone, order.phone);
                        //assert.equal(e.ts, order.ts);
                        done();
                    });
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create order 2', (done)=>{
            const req = new Post(
                {
                    name:'userC',
                    phone:'2222222',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const order = res.result.value;
                assert(order.id);
                assert.equal(4, Object.keys(order).length);
                assert.equal(order.name, 'userC');
                assert.equal(order.phone, '2222222');
                assert(order.ts);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 3);
                    model.orders.peek(order.id.toString(), (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.id, order.id);
                        assert.equal(e.name, order.name);
                        assert.equal(e.phone, order.phone);
                        //assert.equal(e.ts, order.ts);
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

        it('Create an order, missing name field', (done)=>{
            const req = new Post(
                {
                    phone:'3333333',
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

        it('Create an order, missing phone field', (done)=>{
            const req = new Post(
                {
                    name:'userD',
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
                    name:'userD',
                    phone:'3333333',
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

