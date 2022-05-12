'use strict';

const assert = require('assert');
const { check, oneOf } = require('express-validator');

module.exports = function(api) {
    assert(api);

    const rules = () => {
        return [
            check('cid').exists().matches(/^[0-9 ]+$/)
        ];
    }

    const validate = api.lib.validators.validate;

    return {
        rules,
        validate,
    }
}
