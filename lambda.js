
const certificate = require('./lib/certificate');
const api = require('./lib/api');
const log = require('./lib/log');

exports.handler = (event, context, callback) => {
    log.info('event:',JSON.stringify(event, null, 2));
    log.info('remaining time::',context.getRemainingTimeInMillis());

    var response = {};
    var certInfo = {};
    
    log.info('checking:',event.urlList);
    event.urlList.forEach( (target) => {
        if (target.length > 0) {
            response[target] = JSON.stringify
            certificate.getCertificate(target, false, (cert) => {
                certInfo = api.certificateCheck(cert, daysToWarn, dateToCheck);
                response[target] = certInfo;
            });
        }
    });

    callback(null, JSON.stringify(response));
};
