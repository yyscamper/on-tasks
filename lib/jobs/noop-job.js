// Copyright 2015, EMC, Inc.

'use strict';

var di = require('di');

module.exports = noOpJobFactory;
di.annotate(noOpJobFactory, new di.Provide('Job.noop'));
di.annotate(noOpJobFactory, new di.Inject('Job.Base', 'Logger', 'Util', 'uuid', 'Promise'));
function noOpJobFactory(BaseJob, Logger, util, uuid, Promise) {
    var logger = Logger.initialize(noOpJobFactory);
    var refCount = 0;

    /**
     *
     * @param {Object} options
     * @param {Object} context
     * @param {String} taskId
     * @constructor
     */
    function NoOpJob(options, context, taskId) {
        options = options || {};
        context = context || {};
        taskId = taskId || uuid.v4();
        this.delay = options.delay || 0;

        logger.error('noop job dealy:', { delay: this.delay });

        NoOpJob.super_.call(this, logger, options, context, taskId);
    }

    util.inherits(NoOpJob, BaseJob);

    /**
     * @memberOf NoOpJob
     */
    NoOpJob.prototype._run = function run() {
        var self = this;
        refCount += 1;
        logger.info("RUNNING NOOP JOB, refCount=" + refCount.toString());
        Promise.delay(this.delay).then(function() {
            self._done();
        });
    };

    return NoOpJob;
}
