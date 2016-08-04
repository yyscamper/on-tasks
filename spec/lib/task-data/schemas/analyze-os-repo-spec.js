// Copyright 2016, EMC, Inc.
/* jshint node: true */

'use strict';

describe(require('path').basename(__filename), function() {
    var schemaFilePath = '/lib/task-data/schemas/analyze-os-repo.json';

    var canonical = {
        "version": "6.0",
        "repo": "http://10.1.2.3/foo/bar",
        "osName": "esx"
    };

    var negativeSetParam = {
        "version": [null, 123, true],
        "repo": [null, "/foo/bar"]
    };

    var positiveSetParam = {
        "version": ["5.5", "trusty"],
        "repo": ["http://vmware.com/esxi/5.5"]
    };

    var negativeUnsetParam = [
        "version",
        "repo",
        "osName"
    ];

    var positiveUnsetParam = [
    ];

    var SchemaUtHelper = require('./schema-ut-helper');
    new SchemaUtHelper(schemaFilePath, canonical).batchTest(
        positiveSetParam, negativeSetParam, positiveUnsetParam, negativeUnsetParam);
});
