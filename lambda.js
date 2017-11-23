
const certificate = require('./lib/certificate');
const api = require('./lib/api');
const log = require('./lib/log');
const Promise = require('es6-promise').Promise;

const daysToWarn = parseInt(process.env.DAYS_TO_WARN || '30', 10);

exports.handler = (event, context, callback) => {
    log.info('event:',JSON.stringify(event, null, 2));
    log.info('remaining time::',context.getRemainingTimeInMillis());

    var response = {};
    var certInfo = {};
    
    let checks = event.urlList.map( (target) => {
        if (target.length > 0) {
            log.info('promising target:',target);
            return new Promise( (resolve) => {
                certificate.getCertificate(target, false, (cert) => {
                    certInfo = api.certificateCheck(cert, daysToWarn);
                    response[target] = certInfo;
                    resolve(certInfo);
                });
            });
        }
    });

    Promise.all(checks).then( () => {
        log.info('response:',response);
        callback(null, JSON.stringify(response));
    });
};
