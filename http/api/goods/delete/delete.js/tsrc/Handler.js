'use strict';

describe('http.api.goods.delete.delete.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Delete;
    let helpers, Model, createDbName;
    let addGoods;
    before(()=>{
        api = require('yeap_app_server');
        Router = api.lib.express.Router;
        Response = api.lib.express.Response;
        Delete = api.lib.express.Delete;
        helpers = api.db.postgres.helpers;
        Model = require('../../../../../../src/Model');
        createDbName=(name)=>{ return api.db.Db.createDbName('http_api_goods_delete_post_') + name };
        addGoods = (index, count, cb)=>{
            if(index<count) {
                model.goods.create(
                    {
                        gid:`A${index}`,
                        name:`SomeName-${index}`,
                        amount:100+index
                    },
                    (err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            addGoods(index+1, count, cb);
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
            const ROUTE = '/api/goods/delete';
            const METHOD = 'DELETE';
            router = new Router();
            method = api.app_server.routerHelper.createHandler(router, 'http/api/goods/delete/delete.js');
            assert.equal(method.route, ROUTE);
            assert.equal(method.method, METHOD);
            Delete = Delete.bind(undefined, (req)=>{
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

        it('Add 10 goods', (done)=>{
            addGoods(0, 10, (err)=>{
                assert(!err);
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

        it('Delete not existing good', (done)=>{
            const req = new Delete(
                {
                    gid:'1000',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 10);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing good A0', (done)=>{
            const req = new Delete(
                {
                    gid:'A0',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 9);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing good A1', (done)=>{
            const req = new Delete(
                {
                    gid:'A1',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 8);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing good A2', (done)=>{
            const req = new Delete(
                {
                    gid:'A2',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 7);
                    done();
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

        it('Add 10 goods', (done)=>{
            addGoods(0, 10, (err)=>{
                assert(!err);
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

        it('Delete good, missing gid', (done)=>{
            const req = new Delete(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(400, res.result.code);
                assert(res.result.value);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Count goods', (done)=>{
            model.goods.count((err, count)=>{
                assert(!err);
                assert.equal(count, 10);
                done();
            });
        });
    });
});

