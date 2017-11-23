
## SSL/TLS Certificate Monitor [![Build Status](https://travis-ci.org/colbygk/certificate-monitor.svg?branch=master)](https://travis-ci.org/colbygk/certificate-monitor) [![Maintainability](https://api.codeclimate.com/v1/badges/42125197add664d63c42/maintainability)](https://codeclimate.com/github/colbygk/certificate-monitor/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/42125197add664d63c42/test_coverage)](https://codeclimate.com/github/colbygk/certificate-monitor/test_coverage)


### Pingdom Integration

Post Body example:

```
{ "urlList" : ["https://day.scratch.mit.edu"] }
```

Response should look like:

```
{
    "headers": {...},
    "statusCode": 200,
    "body": "{\"https://day.scratch.mit.edu\":{\"ssl_ok\":true}}"
}
```

`ssl_ok` translates into a check on if the SSL certificate will expire within the next 30 days and if the certificate appears to pass CA checks. If either one of these fails, then `ssl_ok` will be false.

### AWS Lambda Integration

```
$ make lambda
```

Creates certificate-monitor-hash.zip. Upload this to your Lambda function and deploy it.

Create an API end-point in AWS that points to this Lambda function. [API Gateway proxy setup](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-integration-settings-integration-response.html)

See `lambda.js` for the response sent back via the AWS API Proxy.

Invokation/testing using cURL:

```
curl -X POST -d '{ "urlList": [ "https://day.scratch.mit.edu" ] }' https://u61j2fb017.execute-api.us-east-1.amazonaws.com/prod/checkSSLCertificate
{"https://day.scratch.mit.edu":{"ssl_ok":true}}
```
