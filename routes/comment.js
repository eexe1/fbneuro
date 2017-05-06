var express = require('express');
var router = express.Router();
var request = require('request');
var neo4j = require('node-neo4j')
var mongoose = require('mongoose')
var _ = require('lodash');
var async  =require("async")
var db = new neo4j(
  'http://fb-hackathon:b.rFQqK9s1nX47.wpq2kglzGgEvDQpd@hobby-cjemgdgfojekgbkegdhoogpl.dbs.graphenedb.com:24789'
);
var parent_node_id = 21;
var parent_question = "This is a question";
var Schema = mongoose.Schema
var Item = new Schema({
  user_id: {
    type: String,
 	default: ''
  },
  question_id: {
    type: String,
      default: ''
  },
  type:{
  	type: Boolean
  },
  message : {
    type: String,
    default: ''
  },
  node_id : {
    type : String,
    default:''
  },
  created:{
    type:Date,
    default:''
  }
})

var ItemModal = mongoose.model('item', Item);

router.get('/item', function(req, res, next){
  var item = {
  	user_id : '',
  	question_id : '123',
    node_id : '',
  	type : true,
    created : "",
    message:""
  }

  ItemModal.create(item, (err, docs) => {
      if (err) {
			res.send({});
      } else {
        var result = {
          id: docs._id
        }
        res.send({})
        ;
      }
    })
});



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/test1', function (req, res, next) {
    request(
        'https://graph.facebook.com/v2.9/515904358769189/comments?limits=100&access_token=EAACEdEose0cBAOfD8Hx6SlfMQZCWAFxoS2LIKg17LcAeejGEgODRsPy0KGlkg9AXcYDCbsKMrs28QRlQUBdF9NQsYiNHhLuTGkvh7h5Pf1dQdfWFe6H4R4eUVEwijpuJzFGDDkDqUqtt8iC1PNbLnmzExEey5qDHZCgGpiAibaYV5Gm98u8bFp9UmPWsAZD',
        function (error, response, body) {
            if(error){
              return res.send("error");
            }
            var json = JSON.parse(body);
            console.log(json.data);
            var question_id = req.query.q_id  == null ? parent_node_id : req.query.q_id;
            if(json == null || json.data ==null ||json.data.length == 0){
              return res.send("no data");
            }
            // for(i=0;i<json.data.length;i++) {
            //     var createTime = json.data[i].created_time;
            //     var message = json.data[i].message;

            //     // console.log(createTime);
            //     // console.log(message);
            // }

            async.eachSeries(json.data, function(obj, callback){
               var createTime = obj.created_time;
                var message = obj.message;
                db.insertNode({
                }, function (err, node) {
                  var id = node._id;
                  if (err) {
                    return callback(err)
                  }else{
                        var item = {
                          user_id : '',
                          question_id : question_id,
                          node_id : id,
                          type : false,
                          message : message,
                          created : createTime
                        }

                        ItemModal.create(item, (err, docs) => {
                            if (err) {
                              callback(err);
                            } else {
                              var sql_child = "MATCH (s),(m) WHERE ID(s) = "+question_id+" AND ID(m) = "+id+" CREATE (s)-[r:Answer]->(m) return s,m,r"
                              // var sql_child = "MATCH (a { ID: '"++"' }), (b { ID: '"+id+"' }) CREATE (a)-[:Answer]->(b)";
                              console.log(sql_child);
                                  db.cypherQuery(sql_child, function (err, result) {
                                        if (err) {
                                               callback(err);
                                        }else{
                                            // res.send(result);
                                             callback(null);
                                        }
                                        // json.name = result.data.name
                                        // console.log(result)

                                  })
                            }
                          })
                  }
                });
            },function done(err) {
                if(err){
                  res.send(err);
                }else{
                  res.send({});
                }
            });
            // console.log('error:', error) // Print the error if one occurred
            // console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
            // // console.log('body:', body) // Print the HTML for the Google homepage.
            // res.send(body);
        }
    )
});

router.get('/test11', function(req, res, next){
    var question_id = req.query.q_id  == null ? parent_node_id : req.query.q_id;
    var sql_root = 'MATCH (s) WHERE ID(s) = '+question_id+' MATCH (s)-[:Answer]->(m) return m';
    console.log(sql_root);
    // var sql_child = 'Match(n:Children) return n';
   

    db.cypherQuery(sql_root, function (err, result) {
        if (err) {
            res.status(404).send(result);
        }else{
            // res.send(result);
            // res.json(result);
            if(result != null){
              var json = result;//JSON.parse(result);
              var data = json.data;
              if(json == null || data == null){
                res.status(404).send({});
              }
              var arr = [];
              for(var i = 0 ; i < data.length; i++){
                arr.push(data[i]["_id"]);
              }
              ItemModal.find({"node_id":{"$in":arr}}, function(err, result){
                if(err){
                  res.status(404).send({});
                }else{
                 
                  var result_data = {};
                  var node = new Array();
                  var relationship = new Array();
                  //parent_node
                  /*
                  */
                  var id = parent_node_id;
                  var name = parent_question;
                  var color = new Array();
                  color.push(_.random(0,10));
                  color.push(_.random(0,10));
                  color.push(_.random(0,10));
                  color.push(_.random(0,10));
                  color.push(_.random(0,10));
                  color.push(_.random(0,10));
                  var size  = _.random(20,40);
                  var tmp = {
                       id : id,
                       name: name,
                       color : color,
                       size: size

                     }
                     node.push(tmp);
                  /*
                  */
                  for(var i = 0; i < result.length; i++){
                    var id = result[i]["node_id"];
                    var name = result[i]["message"];
                    var color = new Array();
                    color.push(_.random(0,10));
                    color.push(_.random(0,10));
                    color.push(_.random(0,10));
                    color.push(_.random(0,10));
                    color.push(_.random(0,10));
                    color.push(_.random(0,10));
                    var size  = _.random(20,40);
                     var tmp = {
                       id : id,
                       name: name,
                       color : color,
                       size: size

                     }

                     var relation = {
                       id_1: question_id,
                       id_2: id
                     }

                     node.push(tmp);
                     relationship.push(relation);
                  }
                  result_data["nodes"] = node;
                  result_data["relationship"] = relationship;
                 res.status(200).send(result_data);
                }
              })
              
            }else{
              res.status(200).send({});
            }
        }
        // json.name = result.data.name
        // console.log(result)

  })
})


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


router.get("/cleardb",function(req, res, next){
  //
   var sql_root = 'MATCH (s),(s)-[r:Answer]->(k) WHERE ID(s) = '+parent_node_id+' DELETE r';
   db.cypherQuery(sql_root, function (err, result) {
        if (err) {
            res.status(404).send("delete fail");
        }else{
            ItemModal.remove({}, function(err, result){
              if(err){
                res.status(404).send("fail to delete mongodb");
              }else{
                res.status(200).send("success");
              }
            });
            // res.json(json);
        }
  })
});



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
