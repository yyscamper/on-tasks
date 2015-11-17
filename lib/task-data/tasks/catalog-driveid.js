// Copyright 2015, EMC, Inc.

module.exports = {
    friendlyName: 'Catalog Drive ID',
    injectableName: 'Task.Catalog.Drive.ID',
    implementsTask: 'Task.Base.Linux.Catalog',
    options: {
        commands: [
            'sudo ls /dev/disk/by-id/'
        ]
    },
    properties: {
        catalog: {
            type: 'driveid'
        }
    }
};
