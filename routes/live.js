var express = require('express');
var router = express.Router();
var springy = require('springy');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("tst");
    res.render('live', { title: 'FB Live Neuron' });
});
module.exports = router;
