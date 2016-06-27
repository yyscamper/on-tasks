// Copyright 2015, EMC, Inc.

'use strict';

module.exports = {
    friendlyName: 'Install Ubuntu',
    injectableName: 'Task.Os.Install.Ubuntu',
    implementsTask: 'Task.Base.Os.Install',
    schemaRef: 'rackhd/schemas/v1/tasks/install-os-general',
    options: {
        osType: 'linux', //readonly options, should avoid change it
        profile: 'install-ubuntu.ipxe',
        installScript: 'ubuntu-preseed',
        installScriptUri: '{{api.templates}}/{{options.installScript}}',
        hostname: 'localhost',
        comport: 'ttyS0',
        domain: 'rackhd',
        completionUri: 'renasar-ansible.pub',
        version: 'trusty',
        repo: '{{api.server}}/ubuntu',
        rootPassword: "RackHDRocks!",
        kvm: false
    },
    properties: {
        os: {
            linux: {
                distribution: 'ubuntu'
            }
        }
    }
};
