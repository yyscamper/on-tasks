// Copyright 2015, EMC, Inc.

'use strict';

module.exports = {
    friendlyName: 'Boot LiveCD',
    injectableName: 'Task.Os.Boot.LiveCD',
    implementsTask: 'Task.Base.Os.Install',
    schemaRef: 'boot-livecd.json',
    options: {
        profile: 'boot-livecd.ipxe',
        completionUri: 'renasar-ansible.pub',
        version: 'livecd',
        repo: '{{api.server}}/LiveCD/{{options.version}}'
    },
    properties: {
        os: {
            linux: {
                distribution: 'livecd'
            }
        }
    }
};
