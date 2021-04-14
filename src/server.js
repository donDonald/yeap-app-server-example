'use strict';

const assert = require('assert');
const Application = require('yeap-app-server');

const openModel = function(api, cb) {
    const model = {};
    model.orders = {
        "0": {
            name: 'John',
            phone: '111111111'
        },
        "1": {
            name: 'Tom',
            phone: '222222222'
        },
        "2": {
            name: 'Jerry',
            phone: '333333333'
        }
    };
    cb(undefined, model);
}

const OPTS = {
    openModel:openModel
};

const app = new Application(OPTS);

app.open(()=>{
    assert.equal(true, app.isOpen());
    Application.assertAppIsOpen(app);
});

