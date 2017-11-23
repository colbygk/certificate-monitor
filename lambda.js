
const certificate = require('./lib/certificate');
const api = require('./lib/api');
const log = require('./lib/log');

const daysToWarn = parseInt(process.env.DAYS_TO_WARN || '30', 10);

exports.handler = (event, context, callback) => {
    log.info('event:',JSON.stringify(event, null, 2));
    log.info('remaining time::',context.getRemainingTimeInMillis());

    var response = {};
    var certInfo = {};
    
    log.info('checking:',event.urlList);
    event.urlList.forEach( (target) => {
        if (target.length > 0) {
            certificate.getCertificate(target, false, (cert) => {
                certInfo = api.certificateCheck(cert, daysToWarn);
                response[target] = certInfo;
            });
        }
    });

    callback(null, JSON.stringify(response));
};
