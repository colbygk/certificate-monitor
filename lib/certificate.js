
const fs = require('fs');
const url = require('url');
const request = require('https').request;

const getCertificate = (atUrl, caFilename, cb) => {
    const options = Object.assign( {
        agent: false,
        method: 'GET',
        rejectUnauthorized: false,
    }, url.parse(atUrl));

    if (caFilename && typeof caFilename === 'string' && caFilename.length > 0) {
        options.ca = fs.readFileSync(caFilename, 'utf8');
    }

    var req = request(options, (res) => {
        var certificateData = res.socket.getPeerCertificate(true);
        certificateData.requestUrl = url.parse(atUrl);
        certificateData.authorized = res.socket.authorized;
        if (typeof certificateData.subject !== 'undefined') {
            cb(certificateData);
        } else {
            cb({});
        }
    });
    req.shouldKeepAlive = false;
    req.end();
};

module.exports.getCertificate = getCertificate;
