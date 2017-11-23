const test = require('tap').test;
const certificate = require('../../lib/certificate');

test('spec', function (t) {
    t.type(certificate, 'object');
    t.type(certificate.getCertificate, 'function');
    t.end();
});

test('spec', function (t) {
    certificate.getCertificate('https://google.com', null, (cert) => {
        t.type(cert, 'object');
        t.type(cert.requestUrl, 'object');
        t.end();
    });
});
