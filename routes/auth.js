const express = require('express');
const router = express.Router();

router.post('/login',function(req, res, next) {
    let params = req.body
    // params.username
    res.send(params);
})

module.exports = router;
