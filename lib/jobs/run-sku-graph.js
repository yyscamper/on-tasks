// Copyright 2015, EMC, Inc.

'use strict';

var di = require('di');

module.exports = runSkuGraphJobFactory;
di.annotate(runSkuGraphJobFactory, new di.Provide('Job.Graph.RunSku'));
    di.annotate(runSkuGraphJobFactory,
    new di.Inject(
        'Job.Base',
        'Services.Waterline',
        'Protocol.TaskGraphRunner',
        'Logger',
        'Assert',
        'uuid',
        'Util',
        'JobUtils.WorkflowTool',
        'Constants',
        'Services.Environment'
    )
);
function runSkuGraphJobFactory(
    BaseJob,
    waterline,
    taskGraphProtocol,
    Logger,
    assert,
    uuid,
    util,
    workflowTool,
    Constants,
    env
) {
    var logger = Logger.initialize(runSkuGraphJobFactory);

    /**
     *
     * @param {Object} options
     * @param {Object} context
     * @param {String} taskId
     * @constructor
     */
    function RunSkuGraphJob(options, context, taskId) {
        RunSkuGraphJob.super_.call(this, logger, options, context, taskId);

        this.nodeId = this.options.nodeId;
        assert.isMongoId(this.nodeId);

        if (!this.options.instanceId) {
            this.options.instanceId = uuid.v4();
        }
        this.graphId = this.options.instanceId;
    }
    util.inherits(RunSkuGraphJob, BaseJob);

    /**
     * @memberOf RunSkuGraphJob
     */
    RunSkuGraphJob.prototype._run = function() {
        var self = this;

        this._subscribeGraphFinished(function(status) {
            assert.string(status);
            if (status === 'succeeded') {
                self._done();
            } else {
                self._done(new Error('Graph ' + self.graphId + ' failed with status ' + status));
            }
        });

        return waterline.nodes.findByIdentifier(this.nodeId)
        .then(function(node) {
            if (!node) {
                throw new Error('Node does not exist');
            }

            //First lookup the graph info from environment
            return env.get('config', {}, _.compact([node.sku, Constants.Scope.Global]))
            .then(function(config) {
                //The graph info in env will take precedence
                if (config.postDiscoveryGraph && config.postDiscoveryGraph.name) {
                    return config.postDiscoveryGraph;
                }

                //If no graph info in env, then try to lookup in sku document
                return waterline.skus.findOne({ id: node.sku })
                .then(function(sku) {
                    if (sku && sku.discoveryGraphName) {
                        logger.deprecate('SKU specified graph should be defined in skupack.');
                    }
                    return {
                        name: sku.discoveryGraphName,
                        options: sku.discoveryGraphOptions
                    };
                });
            });
        })
        .then(function(graphInfo) {
            if (!graphInfo || !graphInfo.name) {
                self._done();
                return;
            }
            logger.debug('run sku specified graph', {
                graphName: graphInfo.name,
                graphOptions: graphInfo.options
            });
            return workflowTool.runGraph(
                graphInfo.name,
                graphInfo.options || {},
                self.nodeId
            );
        })
        .catch(function(error) {
            logger.error('fail to run sku specified graph', {
                nodeId: self.nodeId,
                error: error
            });
            self._done(error);
        });
    };

    return RunSkuGraphJob;
}
