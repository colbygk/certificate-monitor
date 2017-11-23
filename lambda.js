
const certificate = require('./lib/certificate');
const api = require('./lib/api');
const log = require('./lib/log');

const daysToWarn = parseInt(process.env.DAYS_TO_WARN || '30', 10);

exports.handler = (event, context, callback) => {
    log.info('event:',JSON.stringify(event, null, 2));
    log.info('remaining time::',context.getRemainingTimeInMillis());

    var response = {};
    var certInfo = {};
    
    event.urlList.forEach( (target) => {
        if (target.length > 0) {
            log.info('checking:',target);
            certificate.getCertificate(target, false, (cert) => {
                log.info('cert:',cert);
                certInfo = api.certificateCheck(cert, daysToWarn);
                log.info('cert:',certInfo);
                response[target] = certInfo;
                log.info('response:',response);
            });
        }
    });

    callback(null, JSON.stringify(response));
};
