// Copyright 2015, EMC, Inc.
/* jshint node:true */

'use strict';

var uuid = require('node-uuid');

module.exports = {

    before: function (callback) {
        before(function () {
            callback(this);
        });
    },

    examples: function () {
        var validator, sandbox, Task;
        var mockWaterline = {
            nodes: {
                needByIdentifier: sinon.stub().resolves({})
            }
        };

        before(function () {
            this.timeout(3000);
            this.taskdefinition = _.cloneDeep(this.taskdefinition);
            sandbox = sinon.sandbox.create();
            expect(this.taskdefinition).to.be.ok;
            expect(this.taskdefinition).to.be.an.Object;

            return Promise.resolve()
            .then(function() {
                var taskModule = helper.require('/index');
                helper.setupInjector(_.flattenDeep([
                    taskModule.injectables,
                    helper.di.simpleWrapper(mockWaterline, 'Services.Waterline')
                ]));
            })
            .then(function() {
                Task = helper.injector.get('Task.Task');
                validator = helper.injector.get('TaskOption.Validator');
                return validator.register();
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('expected properties', function() {
            it('should have a friendly name', function() {
                expect(this.taskdefinition).to.have.property('friendlyName');
                expect(this.taskdefinition.friendlyName).to.be.a('string');
            });

            it('should have an injectableName', function() {
                expect(this.taskdefinition).to.have.property('injectableName');
                expect(this.taskdefinition.injectableName).to.be.a('string');
            });

            it('should have an implementsTask', function() {
                expect(this.taskdefinition).to.have.property('implementsTask');
                expect(this.taskdefinition.implementsTask).to.be.a('string');
                var baseTask = Task.getBaseTask(this.taskdefinition);
                expect(baseTask).to.be.an('object');
            });

            it('should have options', function() {
                expect(this.taskdefinition).to.have.property('options');
                expect(this.taskdefinition.options).to.be.an('Object');
            });

            it('should have properties', function() {
                expect(this.taskdefinition).to.have.property('properties');
                expect(this.taskdefinition.properties).to.be.an('Object');
            });

            it('should have a valid optionsSchema', function() {
                if (this.taskdefinition.optionsSchema &&
                        !_.isString(this.taskdefinition.optionsSchema) &&
                        !_.isObject(this.taskdefinition.optionsSchema)) {
                    throw new Error('optionsSchema must be either string or object if it is not empty'); //jshint ignore: line
                }

                if (_.isString(this.taskdefinition.optionsSchema)) {
                    var schema = validator.getSchema(this.taskdefinition.optionsSchema);
                    expect(schema).to.be.an('object');
                }
            });

            it('should not have unknown property', function() {
                var validKeys = ['friendlyName', 'injectableName', 'implementsTask',
                    'options', 'optionsSchema', 'properties', 'requiredProperties'];
                _.forOwn(this.taskdefinition, function(value, key) {
                    expect(validKeys).to.include(key);
                });
            });

            it('should have valid default option values', function() {
                var self = this;
                var Task = helper.injector.get('Task.Task');
                var jobSchema = Task.getJobSchema(this.taskdefinition);

                //TODO: enable this after all jobs have schema
                if (!jobSchema) {
                    return;
                }

                var fullSchema = Task.getFullSchema(this.taskdefinition);
                var schemaId = uuid.v4(); //genearte random schema identifier

                validator.addSchema(fullSchema, schemaId);
                var schema = _.cloneDeep(
                    validator.getSchemaResolved(schemaId));
                validator.removeSchema(schemaId);

                schema.$schema = "http://json-schema.org/draft-04/schema#"; //To make faker happy

                var faker = require('json-schema-faker');
                var fakeOptions = faker(schema); //generate fake options from schema
                _.defaults(this.taskdefinition.options, fakeOptions);//default options dominate

                //While running workflow, the runJob will be extracted from BaseTask in
                //task-graph.js, but here doesn't run workflow, so the runJob need be manually
                //set.
                this.taskdefinition.runJob = Task.getBaseTask(this.taskdefinition).runJob;

                var env = helper.injector.get('Services.Environment');
                sandbox.stub(env, 'get').resolves();

                //If the task instance can be successfully created from task definition that
                //proves the default values are correct.
                return Task.create(this.taskdefinition, {compileOnly: true}, {target: 'testId'})
                .catch(function(err) {
                    console.error(JSON.stringify({
                        message: 'Create task "' + self.taskdefinition.injectableName + '" fails.',
                        error: err.message,
                        definitions: self.taskdefinition
                    }, null, '    '));
                    throw err;
                });
            });
        });
    }
};
