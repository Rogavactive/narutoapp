const express = require('express');
const router = express.Router();

const database = require('../model/database');
const checkIfAuthenticated = require("../model/authManajer");

router.post('/login', function (req, res, next) {
    let params = req.body
    // params.username
    res.send(params);
})

router.post('/register', function (req, res, next) {
    let params = req.body
    // params.username
    res.send(params);
})

router.get('/details', checkIfAuthenticated, async (req, res) => {
    return res.send({
        id: req.userInfo
    });
});

router.get('/interests', checkIfAuthenticated, async (req, res) => {
    let userId = req.userInfo.user_id

    database.getUserSkills(userId)
        .then(result => {
            res.send(result);
        }).catch((err) => {
            res.status(500)
                .send({error: err})
        })
});

router.get('/replaceInterests', checkIfAuthenticated, async (req, res) => {
    let userId = req.userInfo.user_id
    let interests = req.query.interests || "";

    database.replaceUserSkills(userId, interests.split(','))
        .then(result => {
            res.status(204)
            res.send();
        }).catch((err) => {
            res.status(500)
                .send({error: err})
        })
});

module.exports = router;
