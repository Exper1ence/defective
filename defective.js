/**
 * Created by Exper1ence on 2016/12/14.
 */
require('./defective-globals-stub');
const _ = require('lodash');
const vm = require('vm');
const fs = require('fs');

module.exports = function (cb) {
    if (!_.isFunction(cb))throw new TypeError('The callback should be a Function.');
    vm.runInNewContext(`(${cb.toString()})()`, {
        describe(target, suit){
            suit();
        },
        it(behavior, spec){
            spec();
        },
        expect(expression){
            return {
                toBe(expectation){
                    console.log(expression == expectation);
                }
            }
        }
    });
};
