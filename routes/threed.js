/**
 * Created by Evan on 2017/5/6.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('three', { title: '3D Neuron' });
});

module.exports = router;
