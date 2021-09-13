const express = require('express');
const router = express.Router();

const database = require('../model/database');
const checkIfAuthenticated = require("../model/authManajer");

router.get('/interests', function (req, res, next) {
    let params = req.body
    // params.username
    database.getSkills()
        .then(result => {
            res.send(result)
        })
})

module.exports = router;