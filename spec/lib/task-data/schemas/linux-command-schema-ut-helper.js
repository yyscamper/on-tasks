// Copyright 2016, EMC, Inc.
/* jshint node: true */

'use strict';

var canonical = {
    commands: [
        'touch foo.txt',
        {
            command: 'sudo ipmitool lan print',
            acceptedResponseCodes: [-1, 0, 1, 200],
            catalog: {
                source: 'bmc',
                format: 'json'
            },
            retries: 10,
            downloadUrl: 'http://172.31.128.1:9080/ipmitool',
            timeout: 100
        },
        {
            command: 'ls /usr/bin'
        }
    ],
    runOnlyOnce: true
};

var negativeSetParam = {
    'commands': ['', null, []],
    'commands[0]': ['', null],
    'commands[1].acceptedResponseCodes': [[], 0, 1, -1],
    'commands[1].downloadUrl': ['', 'foo'],
    'commands[1].timeout': [-1, 2.5],
    'commands[1].retries': [-1, 2.5],
    'runOnlyOnce': [null, 'true', 1]
};

var positiveSetParam = {
    'commands[1]': 'touch foo.txt', //allow duplicated command
    'commands[1].timeout': [0, 1, 100000],
    'commands[1].retries': [0, 1, 100000],
    'commands[1].acceptedResponseCodes': [[0]],
    'commands[1].catalog.format': ['xml', 'raw', 'html']
};

var negativeUnsetParam = [
    'commands',
    'commands[1].command',
    'commands[1].catalog.source',
    'commands[2].command'
];

var positiveUnsetParam = [
    'runOnlyOnce',
    'commands[1].acceptedResponseCodes',
    'commands[1].catalog',
    'commands[1].catalog.format',
    'commands[1].retries',
    'commands[1].downloadUrl',
    'commands[1].timeout'
];

module.exports = {
    test: function(schemaFilePath, canonicalData) {
        describe('common linux command validation', function() {
            canonicalData = canonicalData || canonical;
            var SchemaUtHelper = require('./schema-ut-helper');
            new SchemaUtHelper(schemaFilePath, canonicalData).batchTest(
                positiveSetParam, negativeSetParam, positiveUnsetParam, negativeUnsetParam);
        });
    },
    canonical: canonical
};
