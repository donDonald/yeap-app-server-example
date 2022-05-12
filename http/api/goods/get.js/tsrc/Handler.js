'use strict';

describe('http.api.goods.get.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Get;
    let helpers, Model, createDbName;
    let addGoods;
    before(()=>{
        api = require('yeap_app_server');
        Router = api.lib.express.Router;
        Response = api.lib.express.Response;
        Get = api.lib.express.Get;
        const yeap_db = require('yeap_db');
        helpers = yeap_db.postgres.helpers;
        Model = require('../../../../../src/Model');
        createDbName=(name)=>{ return yeap_db.Db.createDbName('http_api_goods_get_') + name };
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
            const ROUTE = '/api/goods';
            const METHOD = 'GET';
            router = new Router();
            method = api.app_server.routerHelper.createHandler(router, 'http/api/goods/get.js');
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

                model.goods.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 0);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Add 1 record', (done)=>{
            addGoods(0, 1, (err)=>{
                assert(!err);
                model.goods.count((err, count)=>{
                    assert(!err);
                    assert.equal(count, 1);
                    done();
                });
            })
        });

        it('Collecting goods with 1 record', (done)=>{
            const req = new Get(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const goods = res.result.value.goods;
                assert.equal(1, Object.keys(goods).length);
                assert.equal(goods[0].gid, 'A0');
                assert.equal(goods[0].name, 'SomeName-0');
                assert.equal(goods[0].amount, 100);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Add 5 records', (done)=>{
            addGoods(1, 6, (err)=>{
                assert(!err);
                model.goods.count((err, count)=>{
                    assert(!err);
                    assert.equal(count, 1+5);
                    done();
                });
            })
        });

        it('Collecting goods with 6 record', (done)=>{
            const req = new Get(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const goods = res.result.value.goods;
                assert.equal(1+5, Object.keys(goods).length);
                assert.equal(goods[0].gid, 'A0');
                assert.equal(goods[0].name, 'SomeName-0');
                assert.equal(goods[0].amount, 100);
                    assert.equal(goods[1].gid, 'A1');
                    assert.equal(goods[1].name, 'SomeName-1');
                    assert.equal(goods[1].amount, 101);
                assert.equal(goods[2].gid, 'A2');
                assert.equal(goods[2].name, 'SomeName-2');
                assert.equal(goods[2].amount, 102);
                    assert.equal(goods[3].gid, 'A3');
                    assert.equal(goods[3].name, 'SomeName-3');
                    assert.equal(goods[3].amount, 103);
                assert.equal(goods[4].gid, 'A4');
                assert.equal(goods[4].name, 'SomeName-4');
                assert.equal(goods[4].amount, 104);
                    assert.equal(goods[5].gid, 'A5');
                    assert.equal(goods[5].name, 'SomeName-5');
                    assert.equal(goods[5].amount, 105);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Collecting gid by id', (done)=>{
            const req = new Get(
                {
                    gid:'A1'
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const good = res.result.value;
                assert.equal(good.name, 'SomeName-1');
                assert.equal(good.amount, 101);
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

        it('Collecting good by missing id', (done)=>{
            const req = new Get(
                {
                    gid:'1000'
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

