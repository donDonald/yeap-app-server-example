'use strict';

const assert = require('assert');
const { check, oneOf } = require('express-validator');

module.exports = function(api) {
    assert(api);

    const rules = () => {
        return [
            check('id').exists().isNumeric().notEmpty(),
            check('name').exists().isString().notEmpty(),
            check('phone').exists().isString().notEmpty(),
        ];
    }

    const validate = api.lib.validators.validate;

    return {
        rules,
        validate,
    }
}
