// Copyright 2016, EMC, Inc.

'use strict';

var di = require('di');

module.exports = taskServiceFactory;
di.annotate(taskServiceFactory, new di.Provide('Services.Task'));
di.annotate(taskServiceFactory, new di.Inject(
    'Logger',
    'Promise',
    'ChildProcess',
    'TaskOption.Validator'
));

function taskServiceFactory(
    Logger,
    Promise,
    ChildProcess,
    validator
) {
    var logger = Logger.initialize(taskServiceFactory);
    var requiredCmdTools = ['ipmitool'];

    function TaskService() {}

    TaskService.prototype.start = function() {
        var self = this;
        return Promise.resolve()
        .then(function() {
            return self.checkToolsExist();
        })
        .then(function() {
            return validator.register();
        });
    };

    TaskService.prototype.stop = function() {
        return Promise.resolve()
        .then(function() {
            return validator.reset();
        });
    };

    TaskService.prototype.checkToolsExist = function() {
        return Promise.map(requiredCmdTools, function(toolName) {
            var childProcess = new ChildProcess('which', [toolName]);
            return childProcess.run({retries: 0, delay: 0})
            .catch(function(err) {
                logger.error('The required tool "' + toolName +
                    '" doesn\'t exist, please check your $PATH configuration');
                throw err;
            });
        });
    };

    return new TaskService();
}
