'use strict';

describe('http.api.goods.add.post.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Post;
    let helpers, Model, createDbName;
    before(()=>{
        api = require('yeap_app_server');
        Router = api.lib.express.Router;
        Response = api.lib.express.Response;
        Post = api.lib.express.Post;
        helpers = api.db.postgres.helpers;
        Model = require('../../../../../../src/Model');
        createDbName=(name)=>{ return api.db.Db.createDbName('http_api_goods_add_post_') + name };
    });

    let router, method, model;
    describe('Setup', ()=>{
        it('Create method', ()=>{
            const ROUTE = '/api/goods/add';
            const METHOD = 'POST';
            router = new Router();
            method = api.app_server.routerHelper.createHandler(router, 'http/api/goods/add/post.js');
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

        it('Create good A0', (done)=>{
            const req = new Post(
                {
                    gid:'A0',
                    name:'SuperGlue',
                    amount:100
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const good = res.result.value;
                assert.equal(4, Object.keys(good).length);
                assert.equal(good.gid, 'A0');
                assert.equal(good.name, 'SuperGlue');
                assert.equal(good.amount, 100);
                assert(good.ts);

                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 1);
                    model.goods.peek(good.gid, (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.gid, good.gid);
                        assert.equal(e.name, good.name);
                        assert.equal(e.amount, good.amount);
                        //assert.equal(e.ts, good.ts);
                        done();
                    });
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create good A1', (done)=>{
            const req = new Post(
                {
                    gid:'A1',
                    name:'SuperDrill',
                    amount:200,
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const good = res.result.value;
                assert.equal(4, Object.keys(good).length);
                assert.equal(good.gid, 'A1');
                assert.equal(good.name, 'SuperDrill');
                assert.equal(good.amount, 200);
                assert(good.ts);

                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 2);
                    model.goods.peek(good.gid, (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.gid, good.gid);
                        assert.equal(e.name, good.name);
                        assert.equal(e.amount, good.amount);
                        //assert.equal(e.ts, good.ts);
                        done();
                    });
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create good A2', (done)=>{
            const req = new Post(
                {
                    gid:'A2',
                    name:'Wooden Table',
                    amount:300
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const good = res.result.value;
                assert.equal(4, Object.keys(good).length);
                assert.equal(good.gid, 'A2');
                assert.equal(good.name, 'Wooden Table');
                assert.equal(good.amount, 300);
                assert(good.ts);

                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 3);
                    model.goods.peek(good.gid, (err, e)=>{
                        assert(!err, err);
                        assert(e);
                        assert.equal(4, Object.keys(e).length);
                        assert.equal(e.gid, good.gid);
                        assert.equal(e.name, good.name);
                        assert.equal(e.amount, good.amount);
                        //assert.equal(e.ts, good.ts);
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

        it('Create a good, missing gid field', (done)=>{
            const req = new Post(
                {
                    name:'SomeName',
                    amount:33
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(400, res.result.code);
                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 0);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create a good, missing name field', (done)=>{
            const req = new Post(
                {
                    gid:'A33',
                    amount:33
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(400, res.result.code);
                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 0);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create a good, missing amount field', (done)=>{
            const req = new Post(
                {
                    gid:'A33',
                    name:'SomeName'
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(400, res.result.code);
                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 0);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });


        it('Create proper good now', (done)=>{
            const req = new Post(
                {
                    gid:'A33',
                    name:'SomeName',
                    amount:33
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 1);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });
    });
});

