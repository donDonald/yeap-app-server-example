'use strict';

describe('http.api.orders.delete.delete.js', ()=>{

    const assert = require('assert');

    let api, masterDbProps, dbProps;
    let Router, Response, Delete;

    before(()=>{
        api = require('yeap-app-server');
        Router = api.lib.testTools.express.Router;
        Response = api.lib.testTools.express.Response;
        Delete = api.lib.testTools.express.Delete;
    });

    let model, router, method;
    describe('Setup', ()=>{

        it('Create method', ()=>{
            const ROUTE = '/api/orders/delete';
            const METHOD = 'DELETE';
            router = new Router();
            method = api.lib.routerHelper.createHandler(router, 'http/api/orders/delete/delete.js');
            assert.equal(method.route, ROUTE);
            assert.equal(method.method, METHOD);

            Delete = Delete.bind(undefined, (req)=>{
                req.app = {
                    zzz: {
                        model:model
                    }
                };
            });
        });
    });

    describe('Main cases', (done)=>{
        before(()=>{
            model = {
                orders:{
                    '0': {
                        name:'nameA',
                        phone:'0000000',
                    },
                    '1': {
                        name:'nameB',
                        phone:'1111111',
                    },
                    '2': {
                        name:'nameC',
                        phone:'2222222',
                    }
                }
            };
        });

        it('Delete not existing order', (done)=>{
            assert.equal(3, Object.keys(model.orders).length);

            const req = new Delete(
                {
                    id:'3',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);
                assert.equal(3, Object.keys(model.orders).length);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing order', (done)=>{
            assert.equal(3, Object.keys(model.orders).length);

            const req = new Delete(
                {
                    id:'0',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);
                assert.equal(2, Object.keys(model.orders).length);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing order', (done)=>{
            assert.equal(2, Object.keys(model.orders).length);

            const req = new Delete(
                {
                    id:'1',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);
                assert.equal(1, Object.keys(model.orders).length);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing order', (done)=>{
            assert.equal(1, Object.keys(model.orders).length);

            const req = new Delete(
                {
                    id:'2',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);
                assert.equal(0, Object.keys(model.orders).length);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });
    });

    describe('Error cases', (done)=>{
        before(()=>{
            model = {
                orders:{
                    '0': {
                        name:'nameA',
                        phone:'0000000',
                    }
                }
            };
        });

        it('Delete order, missing id', (done)=>{
            assert.equal(1, Object.keys(model.orders).length);

            const req = new Delete(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(400, res.result.code);
                assert(res.result.value);
                assert.equal(1, Object.keys(model.orders).length);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });
    });
});

