// Copyright 2016, EMC, Inc.

'use strict';

var di = require('di');

module.exports = workflowToolFactory;

di.annotate(workflowToolFactory, new di.Provide('JobUtils.WorkflowTool'));
di.annotate(workflowToolFactory, new di.Inject(
    'Protocol.TaskGraphRunner',
    'TaskGraph.TaskGraph',
    'TaskGraph.Store',
    'Services.Waterline',
    'Services.Environment',
    'Constants',
    'Errors',
    'Assert',
    '_',
    'Promise'
));

function workflowToolFactory(
    taskGraphProtocol,
    TaskGraph,
    taskGraphStore,
    waterline,
    env,
    Constants,
    Errors,
    assert,
    _,
    Promise
) {
    function WorkflowTool() {}

    /**
     * Run graph by injectableName
     *
     * @param {String} graphName - The injectableName of graph
     * @param {Object} options - The graph options
     * @param {String} nodeId - (Optional) The node identifier that the graph will run against
     * @param {String} context - (Optional) The input graph context
     * @param {String} domain - (Optional) The domain of the target graph
     * @return {Promise}
     */
    WorkflowTool.prototype.runGraph = function(graphName, options, nodeId, context, domain) {
        var graphOptions = options || {};
        var graphDomain = domain || Constants.Task.DefaultDomain;
        return Promise.resolve()
        .then(function() {
            assert.string(graphName);
            if (nodeId) {
                //if nodeId is valid, then to lookup whether the SKU pack defines a graph with
                //the same name, if so, it will take precedence.
                return waterline.nodes.needByIdentifier(nodeId)
                .then(function(node) {
                    return (node.sku ? env.get(graphName, graphName, [node.sku]) : graphName);
                });
            } else {
                return graphName;
            }
        })
        .then(function(name) {
            return taskGraphStore.getGraphDefinitions(name);
        })
        .then(function(definitions) {
            if (_.isEmpty(definitions)) {
                throw new Errors.NotFoundError('Fail to find graph definition for ' +
                    graphName);
            }
            return TaskGraph.create(graphDomain, {
                definition: definitions[0],
                options: graphOptions,
                context: _.defaults(context, { target: nodeId })
            });
        })
        .then(function(graph) {
            return graph.persist();
        })
        .then(function(graph) {
            return taskGraphProtocol.runTaskGraph(graph.instanceId, graphDomain);
        });
   };

   return new WorkflowTool();
}
