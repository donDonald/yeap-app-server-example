'use strict';

describe('http.api.customers.delete.delete.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Delete;
    let helpers, Model, createDbName;
    let addCustomers;
    before(()=>{
        api = require('yeap_app_server');
        Router = api.express.Router;
        Response = api.express.Response;
        Delete = api.express.Delete;
        helpers = api.db.postgres.helpers;
        Model = require('../../../../../../src/Model');
        createDbName=(name)=>{ return api.db.Db.createDbName('http_api_customers_delete_post_') + name };
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
        process.env.APP_ROOT = __dirname + '/../../../../../../';
    });

    after(()=>{
        process.env.APP_ROOT = undefined;
    });

    let router, method, model;
    describe('Setup', ()=>{
        it('Create method', ()=>{
            const ROUTE = '/api/customers/delete';
            const METHOD = 'DELETE';
            router = new Router();
            method = api.app_server.routerHelper.createHandler(router, 'http/api/customers/delete/delete.js');
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

        it('Add 10 customers', (done)=>{
            addCustomers(0, 10, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Count customers', (done)=>{
            model.customers.count((err, count)=>{
                assert(!err);
                assert.equal(count, 10);
                done();
            });
        });

        it('Delete not existing customer', (done)=>{
            const req = new Delete(
                {
                    cid:'1000',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.customers.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 10);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing customer 1', (done)=>{
            const req = new Delete(
                {
                    cid:'1',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.customers.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 9);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing customer 2', (done)=>{
            const req = new Delete(
                {
                    cid:'2',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.customers.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 8);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing customer 3', (done)=>{
            const req = new Delete(
                {
                    cid:'3',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.customers.count((err, count)=>{
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

        it('Add 10 customers', (done)=>{
            addCustomers(0, 10, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Count customers', (done)=>{
            model.customers.count((err, count)=>{
                assert(!err);
                assert.equal(count, 10);
                done();
            });
        });

        it('Delete customer, missing id', (done)=>{
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

        it('Count customers', (done)=>{
            model.customers.count((err, count)=>{
                assert(!err);
                assert.equal(count, 10);
                done();
            });
        });
    });
});

