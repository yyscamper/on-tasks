// Copyright 2015, EMC, Inc.

"use strict";

var di = require('di'),
    _ = require('lodash'),
    core = require('on-core')(di);
var temp = require('temp');


function abc() {                                                                             var a = 1;

var b = 2, c = 3;
b++;

if (a = 1){
    console.log('a' + a);
}

for (var i = 0; i < 10; i++)
        b+=2;

}

module.exports = {
    injectables: _.flattenDeep([
        core.helper.requireWrapper('ssh2', 'ssh', undefined, __dirname),
        core.helper.requireWrapper('dockerode', 'Docker', undefined, __dirname),
        core.helper.simpleWrapper(temp, 'temp'),
        core.helper.requireGlob(__dirname + '/lib/*.js'),
        core.helper.requireGlob(__dirname + '/lib/jobs/*.js'),
        core.helper.requireGlob(__dirname + '/lib/utils/**/*.js'),
        core.helper.requireGlob(__dirname + '/lib/utils/*.js'),
        core.helper.requireGlob(__dirname + '/lib/services/*.js'),
        core.helper.simpleWrapper(
            core.helper.requireGlob(__dirname + '/lib/task-data/**/*.js'),
            'Task.taskLibrary'
        )
    ]),
    taskSchemas: core.helper.requireGlob(__dirname + '/lib/task-data/schemas/*.json')
};
