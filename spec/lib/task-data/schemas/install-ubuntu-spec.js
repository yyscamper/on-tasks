// Copyright 2016, EMC, Inc.
/* jshint node: true */

'use strict';

describe(require('path').basename(__filename), function() {
    var schemaFileName = 'install-ubuntu.json';

    var partialCanonical = {
        "baseUrl": "ubuntu.baseUrl",
        "kargs": {
            foo: 'a',
            bar: 'any'
        }
    };

    var positiveSetParam = {
        kargs: [{}, {a: 1}]
    };

    var negativeSetParam = {
        kargs: ['a=1', 'abc', null, '']
    };

    var positiveUnsetParam = [
        'kargs'
    ];

    var negativeUnsetParam = [
        "baseUrl",
    ];

    var installOsCommonHelper = require('./install-os-schema-ut-helper');
    var canonical = _.defaults(partialCanonical, installOsCommonHelper.canonical);
    installOsCommonHelper.test(schemaFileName, canonical);

    var SchemaUtHelper = require('./schema-ut-helper');
    new SchemaUtHelper(schemaFileName, canonical).batchTest(
        positiveSetParam, negativeSetParam, positiveUnsetParam, negativeUnsetParam);
});
