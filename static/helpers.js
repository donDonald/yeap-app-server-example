'use strict';

const helpers = {};

helpers.errorHandler = function(err) {
    console.log('helpers.errorHandler, err:', err);
    var dialogFailure = dialogFailure || new DialogFailure();
    dialogFailure.run({text:err}).then(()=>{});
}

