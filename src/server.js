'use strict';

const assert = require('assert');
const yeap = require('yeap_app_server');
const yeap_db = require('yeap_db');
const helpers = yeap_db.postgres.helpers;
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

const OPTS = {
    openModel:openModel
};


// Create app
const createApp=()=>{
    const app = new Application(OPTS);
    app.open(()=>{
        assert.equal(true, app.isOpen);
        Application.assertAppIsOpen(app);
    });
}


// Create database and model
const dbName = Model.collectDbName();
helpers.exists(helpers.DB_CRIDENTIALS, dbName, (err, exists)=>{
    assert(!err, err);
    if(!exists) {
        Model.createDatabase(helpers.DB_CRIDENTIALS, dbName, (err)=>{
            assert(!err, err);
            createApp();
        });
    } else {
        createApp();
    }
});



