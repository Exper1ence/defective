/**
 * Created by Exper1ence on 2016/12/15.
 */
"use strict";

require('./../perfection-globals-stub');
const _ = require('lodash');
const vm = require('vm');
const fs = require('fs');
const chalk = require('chalk');

const INDENTATION = '    ';

class Test {
    constructor(target) {
        this.message = target;
    }
    
    prefix(prefix) {
        this.message = `${prefix}# ${this.message} `;
    }
    
    behave(behavior) {
        this.message = `spec: ${this.message + behavior}\n`;
    }
    
    fail(expression, matcher, expectation) {
        this.message += chalk.red(`expect ${expression} to ${matcher} ${expectation}.\n`);
    }
    
    finish() {
        Test.message += this.message;
        console.log(this.stack);
    }
}
Test.message = '';

module.exports = function defective(filename, cb) {
    if (!_.isFunction(cb))throw new TypeError('The callback should be a Function.');
    let prefixSuit;
    let prefix;
    let test;
    const sandbox = {
        describe: function (target, suit) {
            test = new Test(target);
            if (sandbox.describe.caller == prefixSuit) {
                test.prefix(prefix);
            }
            else {
                prefixSuit = suit;
                prefix = target;
            }
            suit();
        },
        it(behavior, spec){
            test.behave(behavior);
            spec();
            test.finish();
        },
        expect(expression){
            return {
                toBe(expectation){
                    if (expression !== expectation) {
                        test.fail(expression, 'be', expectation);
                    }
                }
            }
        }, Error, console,
    };
    vm.runInNewContext(`(${cb.toString()})()`, sandbox, {filename,});
    console.log(Test.message);
};