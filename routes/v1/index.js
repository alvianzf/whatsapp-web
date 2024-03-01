const router = require('express').Router();

// API group
router.use('/authorization', require('./authorization'));
router.use('/messages', require('./messages'));

router.get('/', (req,res) => {
    res.send({
        success: true,
        message: '/v1',
        endpoints: [{
            authorization: '/v1/authorization',
            messages: '/v1/messages',
        }]
    });
});

module.exports = router;