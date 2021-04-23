'use strict';

const assert = require('assert');
const yeap = require('yeap-app-server');
const Application = yeap.lib.Application;

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

const app = new yeap.lib.Application(OPTS);

app.open(()=>{
    assert.equal(true, app.isOpen());
    Application.assertAppIsOpen(app);
});

