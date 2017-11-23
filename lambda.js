
const certificate = require('./lib/certificate');
const api = require('./lib/api');
const log = require('./lib/log');
const Promise = require('es6-promise').Promise;

const daysToWarn = parseInt(process.env.DAYS_TO_WARN || '30', 10);

exports.handler = (event, context, callback) => {
    log.info('event:',event);
    var proxyResponse = Object({
        headers: {},
        statusCode: 200,
        body: ''
    });
    var certInfo = {};
    var response = {};
    
    let checks = JSON.parse(event.body)['urlList'].map( (target) => {
        if (target.length > 0) {
            log.info('target:',target);
            return new Promise( (resolve) => {
                certificate.getCertificate(target, false, (cert) => {
                    certInfo = api.certificateCheck(cert, daysToWarn);
                    response[target] = {};
                    response[target]['ssl_ok'] =
                        (!certInfo.date_warning && certInfo.authorized);
                    resolve(certInfo);
                });
            });
        }
    });

    Promise.all(checks).then( () => {
        log.info('response:',response);
        proxyResponse.body = JSON.stringify(response);
        context.succeed(proxyResponse);
        callback(null, proxyResponse);
    });
};
