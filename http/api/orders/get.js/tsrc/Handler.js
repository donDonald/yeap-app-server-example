'use strict';

describe('http.api.orders.get.js', ()=>{

    const assert = require('assert');

    let api, masterDbProps, dbProps;
    let Router, Response, Get;

    before(()=>{
        api = require('yeap-app-server');
        Router = api.lib.testTools.express.Router;
        Response = api.lib.testTools.express.Response;
        Get = api.lib.testTools.express.Get;
    });

    let model, router, method;
    describe('Setup', ()=>{

        it('Create method', ()=>{
            const ROUTE = '/api/orders';
            const METHOD = 'GET';
            router = new Router();
            method = api.lib.routerHelper.createHandler(router, 'http/api/orders/get.js');
            assert.equal(method.route, ROUTE);
            assert.equal(method.method, METHOD);

            Get = Get.bind(undefined, (req)=>{
                req.app = {
                    zzz: {
                        model:model
                    }
                };
            });
        });
    });

    describe('Main cases', (done)=>{
        it('Collecting empty model', (done)=>{
            model = { orders:{} };

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
                assert.equal(0, Object.keys(orders).length);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Collecting orders with 1 record', (done)=>{
            model.orders = {};
            model.orders['0'] = {name:'name0', phone:'0000000'};

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
                assert.equal(orders['0'].name, 'name0');
                assert.equal(orders['0'].phone, '0000000');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Collecting orders with 10 record', (done)=>{
            model.orders = {};
            model.orders['0'] = {name:'name0', phone:'0000000'};
            model.orders['1'] = {name:'name1', phone:'1111111'};
            model.orders['2'] = {name:'name2', phone:'2222222'};
            model.orders['3'] = {name:'name3', phone:'3333333'};
            model.orders['4'] = {name:'name4', phone:'4444444'};
            model.orders['5'] = {name:'name5', phone:'5555555'};
            model.orders['6'] = {name:'name6', phone:'6666666'};
            model.orders['7'] = {name:'name7', phone:'7777777'};
            model.orders['8'] = {name:'name8', phone:'8888888'};
            model.orders['9'] = {name:'name9', phone:'9999999'};

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
                assert.equal(10, Object.keys(orders).length);
                assert.equal(orders['0'].name, 'name0');
                assert.equal(orders['0'].phone, '0000000');
                    assert.equal(orders['1'].name, 'name1');
                    assert.equal(orders['1'].phone, '1111111');
                assert.equal(orders['2'].name, 'name2');
                assert.equal(orders['2'].phone, '2222222');
                    assert.equal(orders['3'].name, 'name3');
                    assert.equal(orders['3'].phone, '3333333');
                assert.equal(orders['4'].name, 'name4');
                assert.equal(orders['4'].phone, '4444444');
                    assert.equal(orders['5'].name, 'name5');
                    assert.equal(orders['5'].phone, '5555555');
                assert.equal(orders['6'].name, 'name6');
                assert.equal(orders['6'].phone, '6666666');
                    assert.equal(orders['7'].name, 'name7');
                    assert.equal(orders['7'].phone, '7777777');
                assert.equal(orders['8'].name, 'name8');
                assert.equal(orders['8'].phone, '8888888');
                    assert.equal(orders['9'].name, 'name9');
                    assert.equal(orders['9'].phone, '9999999');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Collecting order by id', (done)=>{
            model.orders = {};
            model.orders['5'] = {name:'name5', phone:'5555555'};

            const req = new Get(
                {
                    id:'5'
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const order = res.result.value;
                assert.equal(order.name, 'name5');
                assert.equal(order.phone, '5555555');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });
    });

    describe('Error cases', (done)=>{
        it('Collecting order by missing id', (done)=>{
            model.orders = {};
            model.orders['5'] = {name:'name5', phone:'5555555'};

            const req = new Get(
                {
                    id:'6'
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

