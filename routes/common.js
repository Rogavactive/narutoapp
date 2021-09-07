const express = require('express');
const router = express.Router();

const checkIfAuthenticated = require("../model/authManajer");

router.get('/interests',function(req, res, next) {
    let params = req.body
    // params.username
    res.send(["Python", "Android", "Java", "SQL"]);
})

module.exports = router;