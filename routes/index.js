var express = require('express');
var router = express.Router();
var springy = require('springy');
/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { title: 'FB Neuron' });
});
module.exports = router;
