// Copyright 2016, EMC, Inc.
/* jshint node: true */

'use strict';

describe(require('path').basename(__filename), function() {
    var schemaFileName = 'install-windows.json';

    var partialCanonical = {
        productkey: 'xxxx-xxxx-xxxx-xxxx-xxxx',
        smbUser: 'onrack',
        smbPassword: 'onrack',
        smbRepo: '\\\\172.31.128.1\\windowsServer2012'
    };

    var positiveSetParam = {
        smbRepo: ['\\\\abc.com']
    };

    var negativeSetParam = {
        smbRepo: [null, '', 'http://127.0.0.1/abc'],
        productkey: [null, ''],
        smbUser: [null, ''],
        smbPassword: [null, '']
    };

    var positiveUnsetParam = [
    ];

    var negativeUnsetParam = [
        'productkey',
        'smbUser',
        'smbPassword',
        'smbRepo'
    ];

    var installOsCommonHelper = require('./install-os-schema-ut-helper');
    var canonical = _.defaults(partialCanonical, installOsCommonHelper.canonical);
    installOsCommonHelper.test(schemaFileName, canonical);

    var SchemaUtHelper = require('./schema-ut-helper');
    new SchemaUtHelper(schemaFileName, canonical).batchTest(
        positiveSetParam, negativeSetParam, positiveUnsetParam, negativeUnsetParam);
});
