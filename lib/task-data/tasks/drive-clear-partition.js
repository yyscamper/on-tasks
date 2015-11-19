// Copyright 2015, EMC, Inc.

module.exports = {
    friendlyName: 'Clear Drive Partition',
    injectableName: 'Task.Drive.Clear.Partition',
    implementsTask: 'Task.Base.Linux.Commands',
    options: {
        driveIds: [], //example: [
                      // '/dev/disk/by-id/wwn-0x6001636001940aa01dd55961a20fb847',
                      // '/dev/sda',
                      // '/dev/disk/by-id/ata-SATADOM-SV_3SE_20150522AA999091007C'
                      // ]
        partitionType: 'gpt', //See the full list of partitionType from the parted mklabel command:
                             //https://www.gnu.org/software/parted/manual/html_node/mklabel.html
        commands: [
            /*jshint multistr: true */
            '{{#options.driveIds}}' +
                'sudo parted -s {{.}} mklabel {{options.partitionType}};' +
            '{{/options.driveIds}}'

            // 'for drive in {{ options.driveIds }}; do sudo parted -s $drive ' +
            //     'mklabel {{ options.partitionType }}; done'
        ]
    },
    properties: {
        drive: {
            action: 'clearPartition',
            tool: 'parted'
        }
    }
};
