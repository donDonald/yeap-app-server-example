'use strict';

describe('http.api.customers.add.post.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Post;
    let helpers, Model, createDbName;
    before(()=>{
        api = require('yeap_app_server');
        Router = api.express.Router;
        Response = api.express.Response;
        Post = api.express.Post;
        helpers = api.db.postgres.helpers;
        Model = require('../../../../../../src/Model');
        createDbName=(name)=>{ return api.db.Db.createDbName('http_api_customers_add_post_') + name };
    });

    let router, method, model;
    describe('Setup', ()=>{
        it('Create method', ()=>{
            const ROUTE = '/api/customers/add';
            const METHOD = 'POST';
            router = new Router();
            method = api.app_server.routerHelper.createHandler(router, 'http/api/customers/add/post.js');
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

        it('Create customer 0', (done)=>{
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

                const customer = res.result.value;
                assert.equal(4, Object.keys(customer).length);
                assert(customer.cid);
                assert.equal(customer.name, 'userA');
                assert.equal(customer.phone, '0000000');
                assert(customer.ts);

                model.customers.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 1);
                    model.customers.peek(customer.cid, (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.cid, customer.cid);
                        assert.equal(e.name, customer.name);
                        assert.equal(e.phone, customer.phone);
                        //assert.equal(e.ts, customer.ts);
                        done();
                    });
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create customer 1', (done)=>{
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

                const customer = res.result.value;
                assert(customer.cid);
                assert.equal(4, Object.keys(customer).length);
                assert.equal(customer.name, 'userB');
                assert.equal(customer.phone, '1111111');
                assert(customer.ts);

                model.customers.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 2);
                    model.customers.peek(customer.cid, (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.cid, customer.cid);
                        assert.equal(e.name, customer.name);
                        assert.equal(e.phone, customer.phone);
                        //assert.equal(e.ts, customer.ts);
                        done();
                    });
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create customer 2', (done)=>{
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

                const customer = res.result.value;
                assert(customer.cid);
                assert.equal(4, Object.keys(customer).length);
                assert.equal(customer.name, 'userC');
                assert.equal(customer.phone, '2222222');
                assert(customer.ts);

                model.customers.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 3);
                    model.customers.peek(customer.cid, (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.cid, customer.cid);
                        assert.equal(e.name, customer.name);
                        assert.equal(e.phone, customer.phone);
                        //assert.equal(e.ts, customer.ts);
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

        it('Create an customer, missing name field', (done)=>{
            const req = new Post(
                {
                    phone:'3333333',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(400, res.result.code);
                model.customers.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 0);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create an customer, missing phone field', (done)=>{
            const req = new Post(
                {
                    name:'userD',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(400, res.result.code);
                model.customers.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 0);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });


        it('Create proper customer now', (done)=>{
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
                model.customers.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 1);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });
    });
});

