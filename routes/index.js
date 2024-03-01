const router = require('express').Router();

router.use('/v1', require('./v1'))

router.get('/', (req,res) => {
    res.send({
        status: 200,
        message: 'Welcome to the API'
    })
})


module.exports = router;