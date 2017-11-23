
const certificate = require('./lib/certificate');
const api = require('./lib/api');
const argv = require('minimist')(process.argv.slice(2));

const usage = function() {
    // eslint-disable-next-line no-console
    console.log('Usage: node index.js [--urlsfrom file] [url]\n' +
        '\t--help              This message\n' +
        '\t--urlsfrom filename File to read newline separated urls\n' +
        '\t--cafile filename   Use separate CA file to confirm authority\n' +
        '\t--date date         Specify the date to check against for ' +
        'validity\n' +
        '\t--days number       If this many days away from expiration, ' +
        'warn, default 30\n' +
        '\t--json              Return info as JSON\n' +
        '\t[url]               Check this single URL\n\n' +
        '  Checks each the SSL/TLS certificate for a specified URL\n' +
        '  or URLs from a file (each new-line separated)\n' +
        '  The checks determine if the certificate is considered valid\n' +
        '  Including if the date is considered valid\n' +
        '  By default, uses the system hosts CA resources but you can\n' +
        '  specify a custom CA file to determine if the authority of the\n' +
        '  returned certificates are trusted\n'
    );
    return;
};

var daysToWarn = 30;
if (argv.days) {
    daysToWarn = parseInt(argv.days);
}
var dateToCheck = new Date();
if (argv.date) {
    dateToCheck = new Date(argv.date);
}

if (argv.help) {
    usage();
    return;
}

var urlList = [];

if (argv.urlsfrom) {
    urlList = require('fs').readFileSync(argv.urlsfrom).toString().split('\n');
}

urlList.push.apply(urlList, argv._);

urlList.forEach( (target) => {
    if (target.length > 0) {
        certificate.getCertificate(target, false, (cert) => {
            const certInfo = 
                api.certificateCheck(cert, daysToWarn, dateToCheck);
            if (argv.json) {
                // eslint-disable-next-line no-console
                console.log(api.jsonCertificateCheck(certInfo));
            } else {
                api.logCertificateCheck(certInfo);
            }
        });
    }
});
