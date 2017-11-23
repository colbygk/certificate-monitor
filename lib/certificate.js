
const fs = require('fs');
const url = require('url');
const request = require('https').request;

const getCertificate = (atUrl, caFilename, cb) => {
    const options = Object.assign( {
        rejectUnauthorized: false,
        method: 'GET'
    }, url.parse(atUrl));

    if (caFilename && typeof caFilename === 'string' && caFilename.length > 0) {
        options.ca = fs.readFileSync(caFilename, 'utf8');
    }

    const req = request(options, (res) => {
        const certificateData = res.socket.getPeerCertificate(true);
        certificateData.requestUrl = url.parse(atUrl);
        certificateData.authorized = res.socket.authorized;
        if (certificateData) {
            cb(certificateData);
        }
    });
    req.end();
};

module.exports.getCertificate = getCertificate;
