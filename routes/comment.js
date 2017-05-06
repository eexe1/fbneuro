var express = require('express');
var router = express.Router();
var request = require('request');
var neo4j = require('node-neo4j')
var db = new neo4j(
  'http://fb-hackathon:b.rFQqK9s1nX47.wpq2kglzGgEvDQpd@hobby-cjemgdgfojekgbkegdhoogpl.dbs.graphenedb.com:24789'
)
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

router.get('/test2', function(req, res, next){
  var sql_root = 'Match(n:Admin) return n'
  var sql_child = 'Match(n:Children) return n'
  var json = {}

  db.cypherQuery(sql_root, function (err, result) {
    if (err) {
       res.status(404).send(result);
    }else{
       res.send(result);
    }
    // json.name = result.data.name
    // console.log(result)

  })
})

router.get('/test3', function(req, res, next){
  var sql_root = 'Match(n:Admin) return n'
  var sql_child = 'Match(n:Children) return n'
  var json = {}
  db.insertNode({
	  name: 'Ghuffran',
	  company: 'Modulus',
	  age: 11
  }, function (err, node) {
  if (err) {
    return res.status(404).send(err);
  }
 	res.send(node);
  });
})
// db.insertNode({
//   name: 'Ghuffran',
//   company: 'Modulus',
//   age: ~~(Math.random() * 100)
// }, function (err, node) {
//   if (err) {
//     return console.log(err);
//   }

//   // Output node data.
//   console.log(node);
// });
module.exports = router;
