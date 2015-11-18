// Copyright 2015, EMC, Inc.

module.exports = {
    friendlyName: 'Delete RAID via Storcli',
    injectableName: 'Task.Raid.Delete',
    implementsTask: 'Task.Base.Linux.Commands',
    options: {
        deleteAll: true,
        controller: 0,
        raidIds: [], /*[
            {
                id: 0
            },
            {
                id: 1
            }
        ],*/
        path: '/opt/MegaRAID/storcli/storcli64',
        commands: [
            '{{#options.deleteAll}}\
				sudo {{options.path}} /c{{options.controller}}/vall del force\
			{{/options.deleteAll}}\
			{{^options.deleteAll}}\
			{{#options.raidIds}}\
				sudo {{options.path}} /c{{options.controller}}/v{{id}} del force;\
			{{/options.raidIds}}\
			{{/options.deleteAll}}'
        ]
    },
    properties: {}
};
