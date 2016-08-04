// Copyright 2016, EMC, Inc.
/* jshint node: true */

'use strict';

describe(require('path').basename(__filename), function() {
    var schemaFilePath = '/lib/task-data/schemas/linux-catalog.json';
    var commonHelper = require('./linux-command-schema-ut-helper');
    commonHelper.test(schemaFilePath);
});
