var express = require('express');
var router = express.Router();
var request = require('request');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test1', function (req, res, next) {
  request(
    'https://graph.facebook.com/v2.9/1522579937766909?fields=comments%2Cformat&access_token=EAACEdEose0cBAOEnjGkEkOZCoNPNd4enRUjFZBvFZCLWwIHZAG7Dtp76TA8iSO6saoc9VdeyilfdwrxYGoNXPfQ4QAKqjgofZAIPU523mfAYdKJzjJuuOHq8ZBi6R8ljZBsEHVZCu33E8nKElZBWKIGNTrEs7xZAVjL2eIpumycf7X4M1LV54JKZBAd4vVMo8MgmfwZD',
    function (error, response, body) {
      console.log('error:', error) // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
      // console.log('body:', body) // Print the HTML for the Google homepage.
      res.send(body)
    }
  )
})

module.exports = router;
