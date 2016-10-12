// Copyright 2015, EMC, Inc.

'use strict';

require('on-core/spec/helper');

helper.startTaskServices  = _.once(function() {
    var taskService = helper.injector.get('Services.Task');
    return taskService.start();
});

helper.prepareJobInjector = function(injectors) {
    helper.setupInjector(
        _.flattenDeep([
            helper.require('/lib/utils/task-option-validator.js'),
            helper.require('/lib/jobs/base-job'),
            helper.require('/lib/task-service.js'),
            injectors
        ])
    );
};
