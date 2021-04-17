'use strict';

describe('http.api.orders.add.post.js', ()=>{

    const assert = require('assert');

    let api, masterDbProps, dbProps;
    let Router, Response, Post;

    before(()=>{
        api = require('yeap-app-server');
        Router = api.lib.testTools.express.Router;
        Response = api.lib.testTools.express.Response;
        Post = api.lib.testTools.express.Post;
    });

    let model, router, method;
    describe('Setup', ()=>{

        it('Create method', ()=>{
            const ROUTE = '/api/orders/add';
            const METHOD = 'POST';
            router = new Router();
            method = api.lib.routerHelper.createHandler(router, 'http/api/orders/add/post.js');
            assert.equal(method.route, ROUTE);
            assert.equal(method.method, METHOD);

            Post = Post.bind(undefined, (req)=>{
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
            model = { orders:{} };
        });

        it('Create order 0', (done)=>{
            const req = new Post(
                {
                    id:'0',
                    name:'userA',
                    phone:'0000000',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                assert.equal(1, Object.keys(model.orders).length);
                const order = res.result.value;
                assert.equal(2, Object.keys(order).length);
                assert.equal(order.name, 'userA');
                assert.equal(order.phone, '0000000');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create order 1', (done)=>{
            const req = new Post(
                {
                    id:'1',
                    name:'userB',
                    phone:'1111111',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                assert.equal(2, Object.keys(model.orders).length);
                const order = res.result.value;
                assert.equal(2, Object.keys(order).length);
                assert.equal(order.name, 'userB');
                assert.equal(order.phone, '1111111');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create order 2', (done)=>{
            const req = new Post(
                {
                    id:'2',
                    name:'userC',
                    phone:'2222222',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                assert.equal(3, Object.keys(model.orders).length);
                const order = res.result.value;
                assert.equal(2, Object.keys(order).length);
                assert.equal(order.name, 'userC');
                assert.equal(order.phone, '2222222');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create order 2 again', (done)=>{
            const req = new Post(
                {
                    id:'2',
                    name:'userC',
                    phone:'2222222',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(500, res.result.code);
                assert(res.result.value);
                assert.equal(res.result.value, 'Order 2 already exists');

                assert.equal(3, Object.keys(model.orders).length);
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
                        name:'userA',
                        phone:'0000000'
                    } 
                }
            };
        });

        it('Create an order, missing id field', (done)=>{
            const req = new Post(
                {
                    name:'userD',
                    phone:'3333333',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(400, res.result.code);
                assert.equal(1, Object.keys(model.orders).length);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create an order, missing name field', (done)=>{
            const req = new Post(
                {
                    id:'3',
                    phone:'3333333',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(400, res.result.code);
                assert.equal(1, Object.keys(model.orders).length);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Create an order, missing phone field', (done)=>{
            const req = new Post(
                {
                    id:'3',
                    name:'userD',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(400, res.result.code);
                assert.equal(1, Object.keys(model.orders).length);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });


        it('Create proper order now', (done)=>{
            const req = new Post(
                {
                    id:'3',
                    name:'userD',
                    phone:'3333333',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);

                assert.equal(2, Object.keys(model.orders).length);
                const order = res.result.value;
                assert.equal(2, Object.keys(order).length);
                assert.equal(order.name, 'userD');
                assert.equal(order.phone, '3333333');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });
    });
});

