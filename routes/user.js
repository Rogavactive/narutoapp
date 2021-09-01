const express = require('express');
const router = express.Router();

const checkIfAuthenticated = require("../model/authManajer");

router.post('/login',function(req, res, next) {
    let params = req.body
    // params.username
    res.send(params);
})

router.post('/register',function(req, res, next) {
    let params = req.body
    // params.username
    res.send(params);
})

router.get('/details', checkIfAuthenticated, async (req, res) => {
    return res.send({
        id: req.userInfo
    });
});

module.exports = router;
