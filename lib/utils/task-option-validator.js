// Copyright 2016, EMC, Inc.

'use strict';
var di = require('di');
var path = require('path');

module.exports = taskOptionValidatorFactory;

di.annotate(taskOptionValidatorFactory, new di.Provide('TaskOption.Validator'));
di.annotate(taskOptionValidatorFactory, new di.Inject(
    'JsonSchemaValidator',
    '_',
    'Util'
));

function taskOptionValidatorFactory(
    JsonSchemaValidator,
    _,
    util
) {
    // var defaultNameSpace = '/schemas/tasks/';
    var contextPattern = /\{\{[\s\S]*context\.[\s\S]*\}\}/;
    var SCHEMA_NAMESPACE_JOB = '/jobs/';
    var SCHEMA_NAMESPACE_TASK = '/tasks/';

    function TaskOptionValidator () {
        JsonSchemaValidator.call(this, {
            allErrors: true,
            verbose: true
        });
    }

    util.inherits(TaskOptionValidator, JsonSchemaValidator);

    /**
     * register the validator with all pre defined JSON schemas
     * @param  {String} [schemaDir=lib/task-data/schemas] - Directory for schemas
     * @param  {String} [metaSchemaName=rackhd-task-schema.json] - Meta Schema file name
     * @return {Promise}
     */
    TaskOptionValidator.prototype.register = function () {
        var self = this;
        return self.addSchemasByDir(
            path.resolve(__dirname, '../../lib/task-data/schemas'),
            SCHEMA_NAMESPACE_TASK,
            'rackhd-task-schema.json' //meta schema
        )
        .then(function() {
            return self.addSchemasByDir(
                path.resolve(__dirname, '../../lib/jobs/schemas'),
                SCHEMA_NAMESPACE_JOB
            );
        })
        .then(function () {
            self.customizeKeywords();
        });
    };

    TaskOptionValidator.prototype.getJobSchema  = function(name) {
        return this.getSchema(name, SCHEMA_NAMESPACE_JOB);
    };

    TaskOptionValidator.prototype.getTaskSchema  = function(name) {
        return this.getSchema(name, SCHEMA_NAMESPACE_TASK);
    };

    /**
     * validate JSON data with given JSON schema
     * @param  {Object|String} schema  JSON schema Object or schema ref id
     * @param  {Object} data  JSON data to be validated
     * @return {Boolean}
     */
    TaskOptionValidator.prototype.validateContextSkipped = function (schema, data, namespace) {
        return this.validatePatternsSkipped(schema, data, contextPattern, namespace);
    };

    TaskOptionValidator.prototype.validateJobSchema = function (schema, data, flags) {
        if (flags && flags.skipContext) {
            return this.validatePatternsSkipped(schema, data, contextPattern, SCHEMA_NAMESPACE_JOB);
        }
        else {
            return this.validate(schema, data, SCHEMA_NAMESPACE_JOB);
        }
    };

    TaskOptionValidator.prototype.validateTaskSchema = function (schema, data, flags) {
        if (flags && flags.skipContext) {
            return this.validatePatternsSkipped(schema, data, contextPattern,
                    SCHEMA_NAMESPACE_TASK);
        }
        else {
            return this.validate(schema, data, SCHEMA_NAMESPACE_TASK);
        }
    };

    TaskOptionValidator.prototype.getResolvedTaskSchema = function (schema) {
        return this.getSchemaResolved(schema, SCHEMA_NAMESPACE_TASK);
    };

    TaskOptionValidator.prototype.customizeKeywords = function () {
        // placehoder for readonly keyword validation
        // this.validator.addKeyword('readonly', { validate: function (sch, data) {
        //     return true;
        // }});
    };

    return new TaskOptionValidator();
}
