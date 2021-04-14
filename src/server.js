'use strict';

const assert = require('assert');

const api = {};
const yeap = require('yeap-app-server');

const Application = yeap.Application;
console.log(Application);

const openModel = function(api, cb) {
    const model = {};
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

