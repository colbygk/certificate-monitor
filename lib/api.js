
const log = require('./log');

const certificateCheck = (cert, daysToWarn, dateToCheck) => {
    if (daysToWarn === null) {
        daysToWarn = 30;
    }
    if (dateToCheck === null) {
        dateToCheck = new Date();
    }

    const daysToWarnMillis = daysToWarn * 86400 * 1000;

    var certInfo = Object({
        request_url: cert.requestUrl,
        subject_cn: cert['subject']['CN'],
        subject_alt_name: cert['subjectaltname'],
        authorized: cert['authorized'],
        valid_from: new Date(cert['valid_from']),
        valid_to: new Date(cert['valid_to']),
        days_to_warn: daysToWarn,
        date_checked_against: dateToCheck
    });

    const diff = certInfo.valid_to - dateToCheck;

    certInfo.date_warning = (diff - daysToWarnMillis) <= 0;

    return certInfo;
};

const logCertificateCheck = (certInfo) => {
    log.info('Checking:', certInfo.request_url);
    log.info('subject CN:', certInfo.subject_cn);
    log.info('subject alt:', certInfo.subject_alt_name);
    log.info('authorized:', certInfo.authorized);
    log.info('valid_from:', certInfo.valid_from);
    log.info('valid_to:', certInfo.valid_to);
    log.info('date_warning:', certInfo.date_warning);
    log.info('date_checked_against:', certInfo.date_checked_against);
};

const jsonCertificateCheck = (certInfo) => {
    return JSON.stringify(certInfo);
};


module.exports.logCertificateCheck = logCertificateCheck;
module.exports.jsonCertificateCheck = jsonCertificateCheck;
module.exports.certificateCheck = certificateCheck;
