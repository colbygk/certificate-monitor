var bunyan = require('bunyan');

// Create bunyan logger and request (req) serializer
module.exports = bunyan.createLogger({
    name: 'certificate-monitor',
    serializers: {
        req: bunyan.stdSerializers.req
    }
});

