// Copyright 2015, EMC, Inc.
/* jshint node:true */

'use strict';

describe(require('path').basename(__filename), function () {
    var base = require('./base-tasks-spec');
    var hogan = require('hogan.js');

    base.before(function (context) {
        context.taskdefinition = helper.require('/lib/task-data/tasks/create-raid.js');
    });

    describe('task-data', function () {
        base.examples();
    });

    describe('task options data', function () {
        it('should have an options', function() {
            expect(this.taskdefinition).to.have.property('options');
            expect(this.taskdefinition.options).to.be.an('Object');
        });

        it('should have commands option', function() {
            expect(this.taskdefinition.options).to.have.property('commands');
            expect(this.taskdefinition.options.commands).to.be.an('Array').with.length(1);
        });

        it('command value could be parsed', function() {
            var cmd = this.taskdefinition.options.commands[0];
            expect(function() {
                hogan.parse(hogan.scan(cmd))
            }).to.not.throw(Error);
        });
    });
});