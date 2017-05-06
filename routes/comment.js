var express = require('express');
var router = express.Router();
var request = require('request');
var neo4j = require('node-neo4j')
var mongoose = require('mongoose')
var db = new neo4j(
  'http://fb-hackathon:b.rFQqK9s1nX47.wpq2kglzGgEvDQpd@hobby-cjemgdgfojekgbkegdhoogpl.dbs.graphenedb.com:24789'
)

/*

*/
var Schema = mongoose.Schema
var Item = new Schema({
  user_id: {
    type: String,
 	default: ''
  },
  question_id: {
    type: String
  },
  type:{
  	type: Boolean
  }
})

var ItemModal = mongoose.model('item', Item);

router.get('/item', function(req, res, next){
  var item = {
  	user_id : '',
  	question_id : '123',
  	type : true
  }

  ItemModal.create(item, (err, docs) => {
      if (err) {
			res.send({});
      } else {
        var result = {
          id: docs._id
        }
        res.send({});
      }
    })
});



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/test1', function (req, res, next) {
    request(
        'https://graph.facebook.com/v2.9/515904358769189/comments?limits=100&access_token=EAACEdEose0cBABZBcq2Ow3MFTGBupfydEYps0KILwsvZB6aOvelpZB1FVZBIQFDeW69fMZC7Qn2uysMfsPyoidxliS1Rt9nSVC8wY5tUz93UBcAnuua044gQ8PzbJNijnABAMkODf631msNzuTZC3gvPDDUCmwoJvtxJRGVcf0IGXtQV0Nm9d4a8laleB3fGwZD',
        function (error, response, body) {
            var json = JSON.parse(body);
            console.log(json.data);
            for(i=0;i<json.data.length;i++) {
                var createTime = json.data[i].created_time;
                var message = json.data[i].message;
                console.log(createTime);
                console.log(message);
            }
            console.log('error:', error) // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
            // console.log('body:', body) // Print the HTML for the Google homepage.
            res.send(body);
        }
    )
});

router.get('/test10', function (req, res, next) {
    request(
        'https://graph.facebook.com/v2.9/516006922092266/comments/access_token=EAACEdEose0cBABZBcq2Ow3MFTGBupfydEYps0KILwsvZB6aOvelpZB1FVZBIQFDeW69fMZC7Qn2uysMfsPyoidxliS1Rt9nSVC8wY5tUz93UBcAnuua044gQ8PzbJNijnABAMkODf631msNzuTZC3gvPDDUCmwoJvtxJRGVcf0IGXtQV0Nm9d4a8laleB3fGwZD',
        function (error, response, body) {
            var json = JSON.parse(body);
            console.log(json.data);
            for(i=0;i<json.data.length;i++) {
                var createTime = json.data[i].created_time;
                var message = json.data[i].message;
                console.log(createTime);
                console.log(message);
            }
            var node = [];
            function node(id,name,color,size) {
                this.id = id;
                this.name = name;
                this.color = color;
                this.size = size;
            }
            console.log('error:', error) // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
            // console.log('body:', body) // Print the HTML for the Google homepage.
            res.send(body);
        }
    )
});

router.get('/test2', function(req, res, next){
  var sql_root = 'Match(n:Admin) return n';
  var sql_child = 'Match(n:Children) return n';
  var json = {
      "nodes": [{id:"22",name:"Like",color:[1,1,2,3,4,5],size:20},{id:23,name:"Angry",color:[1,5,5,5,1,1],size:25}],
      "relationship": [{"id_1":"22","id_2":"23"}]
  };

    db.cypherQuery(sql_root, function (err, result) {
        if (err) {
            res.status(404).send(result);
        }else{
            // res.send(result);
            res.json(json);
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
 	res.send(node._id);
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
