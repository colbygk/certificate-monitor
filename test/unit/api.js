const test = require('tap').test;
const api = require('../../lib/api');
const certificate = require('../../lib/certificate');

test('spec', function (t) {
    t.type(api, 'object');
    t.type(api.certificateCheck, 'function');
    t.type(api.jsonCertificateCheck, 'function');
    t.type(api.logCertificateCheck, 'function');
    t.end();
});

test('function', function (t) {
    // Assumes that Google will always have a good certificate... ?
    certificate.getCertificate('https://google.com', null, (cert) => {
        var certInfo = api.certificateCheck(cert);
        t.type(certInfo, 'object');
        t.type(certInfo.request_url, 'object');
        t.ok(certInfo.authorized);
        t.notOk(certInfo.date_warning);
        t.end();
    });
});

test('function', function (t) {
    certificate.getCertificate('https://expired.badssl.com', null, (cert) => {
        var certInfo = api.certificateCheck(cert);
        t.type(certInfo, 'object');
        t.type(certInfo.request_url, 'object');
        t.notOk(certInfo.authorized);
        t.end();
    });
});


test('function', function (t) {
    certificate.getCertificate(
        'https://self-signed.badssl.com', null, (cert) => {
            var certInfo = api.certificateCheck(cert);
            t.type(certInfo, 'object');
            t.type(certInfo.request_url, 'object');
            t.notOk(certInfo.authorized);
            t.end();
        });
});

test('function', function (t) {
    // Assumes that Google will always have a good certificate... ?
    certificate.getCertificate('https://google.com', null, (cert) => {
        var daysToWarn = 5;
        var dateToCheck = new Date(new Date(cert['valid_to'])
            .getTime() - 4 * 86400 * 1000);
        var certInfo = api.certificateCheck(cert, daysToWarn, dateToCheck);
        
        t.type(certInfo, 'object');
        t.type(certInfo.request_url, 'object');
        t.type(certInfo.valid_to, 'object');
        t.ok(certInfo.authorized);
        t.ok(certInfo.date_warning);
        t.end();
    });
});
