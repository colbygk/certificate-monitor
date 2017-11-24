const test = require('tap').test;
const log = require('../../lib/log');

test('spec', function (t) {
    t.type(log, 'object');
    t.type(log.info, 'function');
    t.end();
});

test('function', function (t) {
    t.notOk(log.info('Test world'));
    t.end();
});

