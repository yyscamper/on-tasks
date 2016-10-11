// Copyright 2016, EMC, Inc.

'use strict';

module.exports = {
    friendlyName: 'Set BMC Credentials',
    injectableName: 'Task.Set.BMC.Credentials',
    runJob: 'Job.Linux.Commands',
    options: {
        user: '{{ context.user || monorail }}',
        password: '{{ context.password  }}',
        commands: [
            {
                command: 'sudo ./set_bmc_credentials.sh',
                downloadUrl: '/api/current/templates/set_bmc_credentials.sh'
            }
        ]
    },
    optionsSchema: {
        properties: {
            user: {
                description: 'The IPMI user name',
                type: 'string',
                minLength: 1,
                maxLength: 16
            },
            password: {
                description: 'The IPMI password',
                type: 'string',
                minLength: 1,
                maxLength: 20
            }
        },
        required: ['user', 'password']
    },
    properties: {
        os: {
            linux: {
                type: 'microkernel'
            }
        }
    }
};
