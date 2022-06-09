'use strict';

const assert = require('assert');
const { check, oneOf } = require('express-validator');

module.exports = function(api) {
    assert(api);

    const rules = () => {
        return [
            oneOf([
                check('cid').not().exists(),
                check('cid').exists().isString().notEmpty(),
            ]),
        ];
    }

    const validate = api.validators.validate;

    return {
        rules,
        validate,
    }
}
