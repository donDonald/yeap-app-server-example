'use strict';

describe('Orders', ()=>{
    const assert = require('assert');
    let helpers, Model, Orders, orders, Customers, customers, Goods, goods, dbc, createDbName;
    before(()=>{
        const yeap_db = require('yeap_db');
        helpers = yeap_db.postgres.helpers;
        Customers = require('../Customers');
        Orders = require('../Orders');
        Goods = require('../Goods');
        Model = require('../Model');
        createDbName=(name)=>{ return yeap_db.Db.createDbName('yeap_app_server_example_orders_') + name };
    });

    after((done)=>{
        dbc.close(done);
    });




    let goodA0001, goodA0002, goodA0003;
    describe('Basic', (done)=>{
        it('Check Orders.dbKeys', ()=>{
            assert.equal(typeof Orders.dbKeys, 'object');
            assert.equal(Object.keys(Orders.dbKeys).length, 3);
            assert.equal(Orders.dbKeys.oid, 'oid');
            assert.equal(Orders.dbKeys.cid, 'cid');
            assert.equal(Orders.dbKeys.ts, 'ts');
        });

        it('Setup database, create model', (done)=>{
            const dbName = createDbName('main');
            Model.createDatabase(helpers.DB_CRIDENTIALS, dbName, (err)=>{
                assert(!err, err);
                helpers.connect(helpers.DB_CRIDENTIALS, dbName, (err, db)=>{
                    assert(!err, err);
                    assert(db);
                    dbc = db;
                    customers = new Customers(dbc);
                    orders = new Orders(dbc);
                    goods = new Goods(dbc);
                    done();
                });
            });
        });

        it('Count empty orders', (done)=>{
            orders.count((err, count)=>{
                assert(!err);
                assert.equal(count, 0);
                done();
            });
        });

        it('List empty orders', (done)=>{
            orders.list((err, elements)=>{
                assert(!err);
                assert.equal(elements.length, 0);
                done();
            });
        });

        it('Peek not existing order', (done)=>{
            orders.peek('100', (err, element)=>{
                assert(!err);
                assert(!element);
                done();
            });
        });

        it('Create 1 order for not existing customer', (done)=>{
            orders.create({cid:'1'}, (err, result)=>{
                assert(err);
                assert(!result);
                done();
            });
        });

        it('Create good A0001', (done)=>{
            goods.create({gid:'A0001', name:'Super Ping-Pong', amount:0}, (err, result)=>{
                assert(!err);
                assert(result);
                assert.equal(result.gid, 'A0001');
                assert.equal(result.name, 'Super Ping-Pong');
                assert.equal(result.amount, 0);
                assert(result.ts);
                goodA0001 = result;
                done();
            });
        });

        it('Create good A0002', (done)=>{
            goods.create({gid:'A0002', name:'Mega Mass', amount:0}, (err, result)=>{
                assert(!err);
                assert(result);
                assert.equal(result.gid, 'A0002');
                assert.equal(result.name, 'Mega Mass');
                assert.equal(result.amount, 0);
                assert(result.ts);
                goodA0002 = result;
                done();
            });
        });

        it('Create good A0003', (done)=>{
            goods.create({gid:'A0003', name:'Space Quest 5', amount:0}, (err, result)=>{
                assert(!err);
                assert(result);
                assert.equal(result.gid, 'A0003');
                assert.equal(result.name, 'Space Quest 5');
                assert.equal(result.amount, 0);
                assert(result.ts);
                goodA0003 = result;
                done();
            });
        });

        it('Peek order by not existing customer', (done)=>{
            orders.peekByCustomer(111, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                assert(!err);
                assert(!orders);
                done();
            });
        });
    });




    describe('CustomerA', (done)=>{
        let customerA;
        it('Create customerA', (done)=>{
            customers.create({name:'CustomerA', phone:'1111111'}, (err, result)=>{
                assert(!err);
                assert(result);
                assert(result.cid);
                assert.equal(result.name, 'CustomerA');
                assert.equal(result.phone, '1111111');
                assert(result.ts);
                customerA = result;
                done();
            });
        });

        it('Peek order by customer', (done)=>{
            orders.peekByCustomer(customerA.cid, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                assert(!err);
                assert(!orders);
                done();
            });
        });

        let customerA_order1;
        it('Create 1 order for customerA', (done)=>{
            orders.create({cid:customerA.cid}, (err, result)=>{
                assert(!err);
                assert(result);
                assert(result.oid);
                assert.equal(result.cid, customerA.cid);
                assert(result.ts);
                customerA_order1 = result;
                done();
            });
        });

        it('Peek empty order', (done)=>{
            orders.peek(customerA_order1.oid, (err, order)=>{
              //console.log('-----------------, order:');
              //console.dir(order);
                assert(!err);
                assert(order);
                assert.equal(order.oid, customerA_order1.oid);
                assert.equal(order.cid, customerA.cid);
                assert(order.goods);
                assert.equal(Object.keys(order.goods).length, 0);
                done();
            });
        });

       it('Peek empty orders by customer', (done)=>{
            orders.peekByCustomer(customerA.cid, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                assert(!err);
                assert(orders);
                assert.equal(Object.keys(orders).length, 1);

                let o = orders[customerA_order1.oid];
                assert.equal(Object.keys(o.goods).length, 0);
                done();
            });
        });

        it('Remove that order, check customerA exists', (done)=>{
            orders.remove(customerA_order1.oid, (err, result)=>{
                assert(!err);
                customers.peek(customerA.cid, (err, result)=>{
                    assert(!err);
                    assert(result);
                    assert(result.cid);
                    assert.equal(result.name, 'CustomerA');
                    assert.equal(result.phone, '1111111');
                    assert(result.ts);
                    done();
                });
            });
        });

        it('Remove customerA, check order has gone', (done)=>{
            customers.remove(customerA.cid, (err, result)=>{
                assert(!err);
                orders.peek(customerA_order1.oid, (err, result)=>{
                    assert(!err);
                    assert(!result);
                    customers.count((err, count)=>{
                        assert(!err);
                        assert.equal(0, count);
                        orders.count((err, count)=>{
                            assert(!err);
                            assert.equal(0, count);
                            done();
                        });
                    });
                });
            });
        });

        it('Peek order by customer', (done)=>{
            orders.peekByCustomer(customerA.cid, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                assert(!err);
                assert(!orders);
                done();
            });
        });
    });




    describe('CustomerB', (done)=>{
        let customerB;
        it('Create customerB', (done)=>{
            customers.create({name:'CustomerB', phone:'2222222'}, (err, result)=>{
                assert(!err);
                assert(result);
                assert(result.cid);
                assert.equal(result.name, 'CustomerB');
                assert.equal(result.phone, '2222222');
                assert(result.ts);
                customerB = result;
                done();
            });
        });

        it('Peek order by customer', (done)=>{
            orders.peekByCustomer(customerB.cid, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                assert(!err);
                assert(!orders);
                done();
            });
        });

        let customerB_orders=[];
        it('Create 1 order for customerB', (done)=>{
            orders.create({cid:customerB.cid}, (err, result)=>{
                assert(!err);
                assert(result);
                assert(result.oid);
                assert.equal(result.cid, customerB.cid);
                assert(result.ts);
                customerB_orders[0] = result;
                done();
            });
        });

        it('Peek empty order', (done)=>{
            orders.peek(customerB_orders[0].oid, (err, order)=>{
              //console.log('-----------------, order:');
              //console.dir(order);
                assert(!err);
                assert(order);
                assert.equal(order.oid, customerB_orders[0].oid);
                assert.equal(order.cid, customerB.cid);
                assert(order.goods);
                assert.equal(Object.keys(order.goods).length, 0);
                done();
            });
        });

       it('Peek empty orders by customer', (done)=>{
            orders.peekByCustomer(customerB.cid, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                assert(!err);
                assert(orders);
                assert.equal(Object.keys(orders).length, 1);

                let o = orders[customerB_orders[0].oid];
                assert.equal(Object.keys(o.goods).length, 0);
                done();
            });
        });


        it('Add A0001 to customerB_orders[0]', (done)=>{
            orders.addGood(customerB_orders[0].oid, goodA0001.gid, 1, (err)=>{
                assert.equal(err, 'Not enough amount of good, requested:1, left:0');
                done();
            });
        });

        it('Increase amount of A0001', (done)=>{
            goods.addSomeAmount('A0001', 50, (err, amount)=>{
                assert(!err);
                assert.equal(amount, 50);
                done();
            });
        });

        it('Add 3 of A0001 to customerB_orders[0]', (done)=>{
            orders.addGood(customerB_orders[0].oid, goodA0001.gid, 3, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Count orders', (done)=>{
            orders.count((err, count)=>{
                assert(!err);
                assert.equal(count, 1);
                done();
            });
        });

        it('Peek order', (done)=>{
            orders.peek(customerB_orders[0].oid, (err, order)=>{
              //console.log('-----------------, order:');
              //console.dir(order);
                assert(!err);
                assert(order);
                assert.equal(order.oid, customerB_orders[0].oid);
                assert.equal(order.cid, customerB.cid);
                assert(order.ts);
                assert(order.goods);
                assert.equal(Object.keys(order.goods).length, 1);

                assert(order.goods.A0001);
                assert(Object.keys(order.goods.A0001).length, 3);
                assert.equal(order.goods.A0001.gid, 'A0001');
                assert.equal(order.goods.A0001.name, 'Super Ping-Pong');
                assert.equal(order.goods.A0001.amount, 3);
                done();
            });
        });

        it('Peek order by customer', (done)=>{
            orders.peekByCustomer(customerB.cid, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                //  o-1, A0001x3
                assert(!err);
                assert(orders);
                assert.equal(Object.keys(orders).length, 1);

                let o = orders[Object.keys(orders)[0]];
                assert(o.oid);
                assert(o.cid);
                assert(o.ts);
                assert(o.goods);
                assert(o.goods.A0001);
                assert.equal(o.goods.A0001.amount, 3);
                assert.equal(o.goods.A0001.name, 'Super Ping-Pong');
                done();
            });
        });
    });

 

    describe('CustomerC', (done)=>{
        let customerC;
        it('Create customerC', (done)=>{
            customers.create({name:'CustomerC', phone:'3333333'}, (err, result)=>{
                assert(!err);
                assert(result);
                assert(result.cid);
                assert.equal(result.name, 'CustomerC');
                assert.equal(result.phone, '3333333');
                assert(result.ts);
                customerC = result;
                done();
            });
        });

        it('Peek order by customer', (done)=>{
            orders.peekByCustomer(customerC.cid, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                assert(!err);
                assert(!orders);
                done();
            });
        });

        let customerC_orders=[];
        it('Create 1st order for customerC', (done)=>{
            orders.create({cid:customerC.cid}, (err, result)=>{
                assert(!err);
                assert(result);
                assert(result.oid);
                assert.equal(result.cid, customerC.cid);
                assert(result.ts);
                customerC_orders[0] = result;
                done();
            });
        });

        it('Add A0001 to customerC 1st order', (done)=>{
            orders.addGood(customerC_orders[0].oid, goodA0001.gid, 7, (err)=>{
                assert(!err)
                done();
            });
        });

        it('Peek 1st order', (done)=>{
            orders.peek(customerC_orders[0].oid, (err, order)=>{
              //console.log('-----------------, order:');
              //console.dir(order);
                assert(!err);
                assert(order);
                assert.equal(order.oid, customerC_orders[0].oid);
                assert.equal(order.cid, customerC.cid);
                assert(order.ts);
                assert(order.goods);
                assert.equal(Object.keys(order.goods).length, 1);

                assert(order.goods.A0001);
                assert(Object.keys(order.goods.A0001).length, 3);
                assert.equal(order.goods.A0001.gid, 'A0001');
                assert.equal(order.goods.A0001.name, 'Super Ping-Pong');
                assert.equal(order.goods.A0001.amount, 7);
                done();
            });
        });

        it('Peek order by customer', (done)=>{
            orders.peekByCustomer(customerC.cid, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                //  o-1, A0001x7
                //  o-2, A0002x3
                assert(!err);
                assert(orders);
                assert.equal(Object.keys(orders).length, 1);

                let o = orders[Object.keys(orders)[0]];
                assert(o.oid);
                assert(o.cid);
                assert(o.ts);
                assert(o.goods);
                assert(o.goods.A0001);
                assert.equal(o.goods.A0001.amount, 7);
                assert.equal(o.goods.A0001.name, 'Super Ping-Pong');
                done();
            });
        });




        it('Create 2nd order for customerC', (done)=>{
            orders.create({cid:customerC.cid}, (err, result)=>{
                assert(!err);
                assert(result);
                assert(result.oid);
                assert.equal(result.cid, customerC.cid);
                assert(result.ts);
                customerC_orders[1] = result;
                done();
            });
        });

        it('Add A0002 to customerC 2nd order', (done)=>{
            orders.addGood(customerC_orders[1].oid, goodA0002.gid, 3, (err)=>{
                assert.equal(err, 'Not enough amount of good, requested:3, left:0');
                done();
            });
        });

        it('Increase amount of A0002', (done)=>{
            goods.addSomeAmount('A0002', 10, (err, amount)=>{
                assert(!err);
                assert.equal(amount, 10);
                done();
            });
        });

        it('Add A0002 to customerC 2nd order', (done)=>{
            orders.addGood(customerC_orders[1].oid, goodA0002.gid, 3, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Peek 2nd order', (done)=>{
            orders.peek(customerC_orders[1].oid, (err, order)=>{
              //console.log('-----------------, order:');
              //console.dir(order);
                assert(!err);
                assert(order);
                assert.equal(order.oid, customerC_orders[1].oid);
                assert.equal(order.cid, customerC.cid);
                assert(order.ts);
                assert(order.goods);
                assert.equal(Object.keys(order.goods).length, 1);

                assert(order.goods.A0002);
                assert(Object.keys(order.goods.A0002).length, 3);
                assert.equal(order.goods.A0002.gid, 'A0002');
                assert.equal(order.goods.A0002.name, 'Mega Mass');
                assert.equal(order.goods.A0002.amount, 3);
                done();
            });
        });

        it('Peek order by customer', (done)=>{
            orders.peekByCustomer(customerC.cid, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                //  o-1, A0001x7
                //  o-2, A0002x3
                assert(!err);
                assert(orders);
                assert.equal(Object.keys(orders).length, 2);

                let o = orders[Object.keys(orders)[0]];
                assert(o.oid);
                assert(o.cid);
                assert(o.ts);
                assert(o.goods);
                assert(o.goods.A0001);
                assert.equal(o.goods.A0001.amount, 7);
                assert.equal(o.goods.A0001.name, 'Super Ping-Pong');

                o = orders[Object.keys(orders)[1]];
                assert(o.oid);
                assert(o.cid);
                assert(o.ts);
                assert(o.goods);
                assert(o.goods.A0002);
                assert.equal(o.goods.A0002.amount, 3);
                assert.equal(o.goods.A0002.name, 'Mega Mass');
                done();
            });
        });




        it('Create 3rd order for customerC', (done)=>{
            orders.create({cid:customerC.cid}, (err, result)=>{
                assert(!err);
                assert(result);
                assert(result.oid);
                assert.equal(result.cid, customerC.cid);
                assert(result.ts);
                customerC_orders[2] = result;
                done();
            });
        });

        it('Add A0003 to customerC 3rd order', (done)=>{
            orders.addGood(customerC_orders[2].oid, goodA0003.gid, 1, (err)=>{
                assert.equal(err, 'Not enough amount of good, requested:1, left:0');
                done();
            });
        });

        it('Increase amount of A0003', (done)=>{
            goods.addSomeAmount('A0003', 10, (err, amount)=>{
                assert(!err);
                assert.equal(amount, 10);
                done();
            });
        });

        it('Add A0002 to customerC 3rd order', (done)=>{
            orders.addGood(customerC_orders[2].oid, goodA0002.gid, 2, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Add A0003 to customerC 3rd order', (done)=>{
            orders.addGood(customerC_orders[2].oid, goodA0003.gid, 1, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Peek order', (done)=>{
            orders.peek(customerC_orders[2].oid, (err, order)=>{
              //console.log('-----------------, order:');
              //console.dir(order);
                assert(!err);
                assert(order);
                assert.equal(order.oid, customerC_orders[2].oid);
                assert.equal(order.cid, customerC.cid);
                assert(order.ts);
                assert(order.goods);
                assert.equal(Object.keys(order.goods).length, 2);

                assert(order.goods.A0002);
                assert(Object.keys(order.goods.A0002).length, 3);
                assert.equal(order.goods.A0002.gid, 'A0002');
                assert.equal(order.goods.A0002.name, 'Mega Mass');
                assert.equal(order.goods.A0002.amount, 2);

                assert(order.goods.A0003);
                assert(Object.keys(order.goods.A0003).length, 3);
                assert.equal(order.goods.A0003.gid, 'A0003');
                assert.equal(order.goods.A0003.name, 'Space Quest 5');
                assert.equal(order.goods.A0003.amount, 1);
                done();
            });
        });

        it('Peek order by customer', (done)=>{
            orders.peekByCustomer(customerC.cid, (err, orders)=>{
              //console.log('-----------------, orders:');
              //console.dir(orders);
                //  o-1, A0001x7
                //  o-2, A0002x3
                //  o-3, A0002x2
                //  o-3, A0003x1
                assert(!err);
                assert(orders);
                assert.equal(Object.keys(orders).length, 3);

                let o = orders[Object.keys(orders)[0]];
                assert(o.oid);
                assert(o.cid);
                assert(o.ts);
                assert(o.goods);
                assert(o.goods.A0001);
                assert.equal(o.goods.A0001.amount, 7);
                assert.equal(o.goods.A0001.name, 'Super Ping-Pong');

                o = orders[Object.keys(orders)[1]];
                assert(o.oid);
                assert(o.cid);
                assert(o.ts);
                assert(o.goods);
                assert(o.goods.A0002);
                assert.equal(o.goods.A0002.amount, 3);
                assert.equal(o.goods.A0002.name, 'Mega Mass');

                o = orders[Object.keys(orders)[2]];
                assert(o.oid);
                assert(o.cid);
                assert(o.ts);
                assert(o.goods);
                assert(o.goods.A0002);
                assert.equal(o.goods.A0002.amount, 2);
                assert.equal(o.goods.A0002.name, 'Mega Mass');
                assert(o.goods.A0003);
                assert.equal(o.goods.A0003.amount, 1);
                assert.equal(o.goods.A0003.name, 'Space Quest 5');
                done();
            });
        });
    });

});

