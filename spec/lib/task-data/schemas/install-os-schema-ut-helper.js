// Copyright 2016, EMC, Inc.
/* jshint node: true */

'use strict';

var canonical = {
    "osType": "linux",
    "comport": "ttyS0",
    "profile": "install-centos.ipxe",
    "installScript": "centos-ks",
    "installScriptUri": "http://172.31.128.1:8090/api/1.1/templates/centos-ks",
    "version": "7",
    "repo": "http://172.31.128.1:9080/centos/7/os/x86_64",
    "rootPassword": "RackHDRocks!",
    "hostname": "rackhd-node",
    "domain": "example.com",
    "rootSshKey": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDJQ631/sw3D40h/6JfA+PFVy5Ofz6eu7ca",
    "dnsServers": [
        "172.12.88.91",
        "192.168.20.77"
    ],
    "networkDevices": [
        {
            "device": "ens802f0",
            "ipv4": {
                "ipAddr": "192.168.1.29",
                "gateway": "192.168.1.1",
                "netmask": "255.255.255.0",
                "vlanIds": [
                    104,
                    105
                ]
            },
            "ipv6": {
                "ipAddr": "fec0::6ab4:0:5efe:157.60.14.21",
                "gateway": "fe80::5efe:131.107.25.1",
                "netmask": "ffff.ffff.ffff.ffff.0.0.0.0",
                "vlanIds": [
                    101,
                    106
                ]
            }
        },
        {
            "device": "eth0",
            "ipv4": {
                "ipAddr": "192.168.11.89",
                "gateway": "192.168.11.1",
                "netmask": "255.255.255.0"
            }
        },
        {
            "device": "ens802f1",
            "ipv6": {
                "ipAddr": "fec0::6ab4:0:5efe:157.60.14.21",
                "gateway": "fe80::5efe:131.107.25.1",
                "netmask": "ffff.ffff.ffff.ffff.0.0.0.0"
            }
        },
    ],
    "installDisk": "/dev/sda"
};

var positiveSetParam = {
    version: ["trusty", "6", "6.5", "6_8", "LATEST", "0.*"],
    installDisk: ["sda", "naa.123", "/dev/sdb", 0, 1, null],
    "networkDevices[0].ipv4.vlanIds[0]": [0, 1009, 4095]
};

var negativeSetParam = {
    osType: 'foo',
    profile: '',
    installScript: '',
    installScriptUri: 'foo',
    version: [7, 6.5, 'a b', 'a/b', 'a\\b', 'a\tb', 'a\nb'],
    repo: ["foo", 12, '', 'https://abc.com/os', 'tftp://abc.com/abc'],
    installDisk: [-1],
    "networkDevices[0].ipv4.ipAddr": ["foo/bar", "300.100.9.0"],
    "networkDevices[0].ipv4.vlanIds[0]": [-1, 4096, 10000]
};

var positiveUnsetParam = [
    "networkDevices",
    "installDisk",
    "dnsServers",
    "rootSshKey",
    "domain",
];

var negativeUnsetParam = [
    "comport",
    "profile",
    "installScript",
    "installScriptUri",
    "version",
    "repo",
    "rootPassword",
    "networkDevices[0].device",
    "networkDevices[1].ipv4.ipAddr",
    "networkDevices[2].ipv6.netmask"
];

module.exports = {
    test: function(schemaFileName, canonicalData) {
        describe('common install os schema validation', function() {
            canonicalData = canonicalData || canonical;
            var SchemaUtHelper = require('./schema-ut-helper');
            new SchemaUtHelper(schemaFileName, canonicalData).batchTest(
                positiveSetParam, negativeSetParam, positiveUnsetParam, negativeUnsetParam);
        });
    },
    canonical: canonical
};
