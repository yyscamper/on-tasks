// Copyright 2016, EMC, Inc.
/* jshint node:true */
'use strict';

describe("Services.Task", function () {
    var validator;
    var subject;
    var MockChildProcess = sinon.stub();
    MockChildProcess.prototype.run = sinon.stub().resolves();

    before(function() {
        helper.setupInjector(
            _.flattenDeep([
                helper.di.simpleWrapper(MockChildProcess, 'ChildProcess'),
                helper.require('/lib/task-service.js'),
                helper.require('/lib/utils/task-option-validator.js')
            ])
        );
        subject = helper.injector.get('Services.Task');
        validator = helper.injector.get('TaskOption.Validator');
        this.sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        this.sandbox.restore();
    });

    describe('start', function() {
        it('should have a start function', function() {
            expect(subject).to.have.property('start').is.a('function').with.length(0);
        });

        it('should succeed to start service', function() {
            this.sandbox.stub(validator, 'register').resolves();
            this.sandbox.stub(subject, 'checkToolsExist').resolves();
            return subject.start()
            .then(function() {
                expect(validator.register).to.have.been.calledOnce;
                expect(subject.checkToolsExist).to.have.been.calledOnce;
            });
        });

        it('should fail to start service if required tools are missing', function(done) {
            this.sandbox.stub(subject, 'checkToolsExist').rejects();
            this.sandbox.stub(validator, 'register').resolves();
            subject.start()
            .then(function() {
                done(new Error('The promise should not be fulfilled'));
            })
            .catch(function() {
                expect(subject.checkToolsExist).to.have.been.calledOnce;
                done();
            });
        });

        it('should fail to start service if register validator fails', function(done) {
            this.sandbox.stub(subject, 'checkToolsExist').resolves();
            this.sandbox.stub(validator, 'register').rejects();
            subject.start()
            .then(function() {
                done(new Error('the promise should not be fulfilled'));
            })
            .catch(function() {
                expect(validator.register).to.have.been.calledonce;
                done();
            });
        });
    });

    describe('stop', function() {
        it('should have a stop function', function() {
            expect(subject).to.have.property('stop').is.a('function').with.length(0);
        });

        it('should succeed to stop service', function() {
            this.sandbox.stub(validator, 'reset').resolves();
            return subject.stop()
            .then(function() {
                expect(validator.reset).to.have.been.calledOnce;
            });
        });

        it('should fail to stop service if reseting validator fails', function(done) {
            this.sandbox.stub(validator, 'reset').rejects();
            subject.stop()
            .then(function() {
                done(new Error('the promise should not be fulfilled'));
            })
            .catch(function() {
                expect(validator.reset).to.have.been.calledonce;
                done();
            });
        });
    });

    describe('checkToolsExist', function() {
        var ChildProcess;
        before('checkToolsExist before', function() {
            ChildProcess = helper.injector.get('ChildProcess');
        });

        it('should be fulfilled if all command tools exist', function() {
            ChildProcess.prototype.run.resolves();
            return subject.checkToolsExist()
            .then(function() {
                expect(ChildProcess.prototype.run).to.have.been.called;
            });
        });

        it('should be rejected if any command tool doesn\'t exist', function(done) {
            ChildProcess.prototype.run.rejects();
            subject.checkToolsExist()
            .then(function() {
                done(new Error('the promise should not be fulfilled'));
            })
            .catch(function() {
                expect(ChildProcess.prototype.run).to.have.been.called;
                done();
            });
        });
    });
});
