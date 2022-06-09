'use strict';

const assert = require('assert');
const { check, oneOf } = require('express-validator');

module.exports = function(api) {
    assert(api);

    const rules = () => {
        return [
            check('gid').exists().matches(/^[A-Za-z0-9 ]+$/)
        ];
    }

    const validate = api.validators.validate;

    return {
        rules,
        validate,
    }
}
