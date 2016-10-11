// Copyright 2015, EMC, Inc.

'use strict';

module.exports = {
    friendlyName: 'Flash MegaRAID Controller',
    injectableName: 'Task.Linux.Flash.LSI.MegaRAID',
    runJob: 'Job.Linux.Commands',
    optionSchema: {
        properties: {
            file: {
                description: 'the AMI image name',
                type: 'string'
            },
            downloadDir: {
                description: 'the backup directory to stored the current AMI image',
                type: 'string'
            },
            adapter: {
                description: 'The MegaRAID adapter identifier',
                oneOf: [
                    { type: 'string', pattern: '^[0-9]+$' },
                    { type: 'string', enum: [ 'ALL'] },
                    { type: 'integer', minimum: 0 }
                ]
            }
        },
        required: ['file', 'downloadDir', 'adapter']
    },
    options: {
        downloadDir: '/opt/downloads',
        adapter: '0',
        commands: [
            'sudo /opt/MegaRAID/storcli/storcli64 /c{{ options.adapter }} download ' +
                'file={{ options.downloadDir }}/{{ options.file }} noverchk',
            'sudo /opt/MegaRAID/MegaCli/MegaCli64 -AdpSetProp -BatWarnDsbl 1 ' +
                '-a{{ options.adapter }}',
        ]
    },
    properties: {
        flash: {
            type: 'storage',
            vendor: {
                lsi: {
                    controller: 'megaraid'
                }
            }
        }
    }
};
