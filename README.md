
## SSL/TLS Certificate Monitor [![Build Status](https://travis-ci.org/colbygk/certificate-monitor.svg?branch=master)](https://travis-ci.org/colbygk/certificate-monitor) [![Maintainability](https://api.codeclimate.com/v1/badges/42125197add664d63c42/maintainability)](https://codeclimate.com/github/colbygk/certificate-monitor/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/42125197add664d63c42/test_coverage)](https://codeclimate.com/github/colbygk/certificate-monitor/test_coverage)

This module can be used as a stand-alone CLI utility or integrated with a third party monitoring service combined with AWS Lambda.

### Stand-Alone CLI

(TODO: provide bash wrapper/install into /usr/local)

```bash
$ node index.js --help
Usage: node index.js [--urlsfrom file] [url]
	--help              This message
	--urlsfrom filename File to read newline separated urls
	--cafile filename   Use separate CA file to confirm authority
	--date date         Specify the date to check against for validity
	--days number       If this many days away from expiration, warn, default 30
	--json              Return info as JSON
	[url]               Check this single URL

  Checks each the SSL/TLS certificate for a specified URL
  or URLs from a file (each new-line separated)
  The checks determine if the certificate is considered valid
  Including if the date is considered valid
  By default, uses the system hosts CA resources but you can
  specify a custom CA file to determine if the authority of the
  returned certificates are trusted
```

* Check a single URL and process the output via Bunyan:

```bash
$ node index.js https://google.com | ./node_modules/.bin/bunyan
[2017-11-23T19:52:53.414Z]  INFO: certificate-monitor/37777 on Tethys:
    Checking: Url { protocol: 'https:',
      slashes: true,
      auth: null,
      host: 'google.com',
      port: null,
      hostname: 'google.com',
      hash: null,
      search: null,
      query: null,
      pathname: '/',
      path: '/',
      href: 'https://google.com/' }
[2017-11-23T19:52:53.415Z]  INFO: certificate-monitor/37777 on Tethys: subject CN: *.google.com
[2017-11-23T19:52:53.415Z]  INFO: certificate-monitor/37777 on Tethys: subject alt: DNS:*.google.com, DNS:*.android.com, DNS:*.appengine.google.com, DNS:*.cloud.google.com, DNS:*.db833953.google.cn, DNS:*.g.co, DNS:*.gcp.gvt2.com, DNS:*.google-analytics.com, DNS:*.google.ca, DNS:*.google.cl, DNS:*.google.co.in, DNS:*.google.co.jp, DNS:*.google.co.uk, DNS:*.google.com.ar, DNS:*.google.com.au, DNS:*.google.com.br, DNS:*.google.com.co, DNS:*.google.com.mx, DNS:*.google.com.tr, DNS:*.google.com.vn, DNS:*.google.de, DNS:*.google.es, DNS:*.google.fr, DNS:*.google.hu, DNS:*.google.it, DNS:*.google.nl, DNS:*.google.pl, DNS:*.google.pt, DNS:*.googleadapis.com, DNS:*.googleapis.cn, DNS:*.googlecommerce.com, DNS:*.googlevideo.com, DNS:*.gstatic.cn, DNS:*.gstatic.com, DNS:*.gvt1.com, DNS:*.gvt2.com, DNS:*.metric.gstatic.com, DNS:*.urchin.com, DNS:*.url.google.com, DNS:*.youtube-nocookie.com, DNS:*.youtube.com, DNS:*.youtubeeducation.com, DNS:*.yt.be, DNS:*.ytimg.com, DNS:android.clients.google.com, DNS:android.com, DNS:developer.android.google.cn, DNS:developers.android.google.cn, DNS:g.co, DNS:goo.gl, DNS:google-analytics.com, DNS:google.com, DNS:googlecommerce.com, DNS:source.android.google.cn, DNS:urchin.com, DNS:www.goo.gl, DNS:youtu.be, DNS:youtube.com, DNS:youtubeeducation.com, DNS:yt.be
[2017-11-23T19:52:53.415Z]  INFO: certificate-monitor/37777 on Tethys: authorized: true
[2017-11-23T19:52:53.415Z]  INFO: certificate-monitor/37777 on Tethys: valid_from: 2017-11-01T13:42:45.000Z
[2017-11-23T19:52:53.415Z]  INFO: certificate-monitor/37777 on Tethys: valid_to: 2018-01-24T13:30:00.000Z
[2017-11-23T19:52:53.415Z]  INFO: certificate-monitor/37777 on Tethys: date_warning: false
[2017-11-23T19:52:53.415Z]  INFO: certificate-monitor/37777 on Tethys: date_checked_against: 2017-11-23T19:52:53.308Z
```

* Check multiple URLs using a file with line-separated URLs by passing the name of the file via `--urlsfrom`
* By default, the `date_warning` will check 30 days in advance and will be true if the detected SSL certificate is going to expire within that time period. You can specify different numbers of days via `--days`. You can specify a particular date to test from via `--date`

### Arbitrary API setup

```javascript
const cm = require('certificate-monitor').certificate;
const cmapi = require('certificate-monitor').api;
cm.getCertificate(target, false, (cert) => {
    const certInfo = 
       cmapi.certificateCheck(cert, daysToWarn, dateToCheck);
});
```

`certInfo` will contain information about the certificate and when it will expire/has expired.

### AWS API and Lambda Integration

```
$ make lambda
```

Creates certificate-monitor-hash.zip. Upload this to your Lambda function and deploy it, e.g. `certificate-monitor-917a41b.zip`

Create an API end-point in AWS that points to this Lambda function. [API Gateway proxy setup](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-integration-settings-integration-response.html)

See `lambda.js` for the response sent back via the AWS API Proxy.

Upload the certificate-monitor-hash.zip that you've created to the Lambda function.

Invokation/testing using cURL:

```bash
$ curl -X POST -d '{ "urlList": [ "https://google.com" ] }' https://#########.execute-api.us-east-1.amazonaws.com/prod/certificate-monitor
{"https://google.com":{"ssl_ok":true}}
```

### Pingdom Integration and AWS Lambda

Post Body example:

```json
{ "urlList" : ["https://google.com"] }
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

If you wish to check multiple domains via one uptime pingdom check, you can add more to the `urlList`, e.g. `["https://google.com", "...",...]` and then check that the returned result does not contain `"ssl_ok":false`


