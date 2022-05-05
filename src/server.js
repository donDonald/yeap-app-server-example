'use strict';

const assert = require('assert');
const yeap = require('yeap_app_server');
const Application = yeap.app_server.Application;
const Model = require('./Model');

// Setup model
const openModel = (app, cb)=>{
    assert(app);
    assert(cb);
    const databases = app.databases;
    const dbcs = Object.entries(databases.connections);
    const dbc = dbcs[0][1];
    const model = new Model(dbc);
    cb(undefined, model);
}

const dbName = Model.collectDbName();
Model.createDatabase(dbName, (err)=>{
    assert(!err);

    const OPTS = {
        openModel:openModel
    };

    const app = new Application(OPTS);
    app.open(()=>{
        assert.equal(true, app.isOpen);
        Application.assertAppIsOpen(app);
    });
});

