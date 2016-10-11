// Copyright 2015, EMC, Inc.

'use strict';

module.exports = {
    friendlyName: 'Analyze Esx Repository',
    injectableName: 'Task.Os.Esx.Analyze.Repo',
    runJob: 'Job.Os.Analyze.Repo',
    options: {
        osName: 'ESXi',
        repo: '{{file.server}}/esxi/{{options.version}}'
    },
    properties: {}
};
