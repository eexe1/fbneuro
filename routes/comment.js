var express = require('express');
var router = express.Router();
var request = require('request');
var neo4j = require('node-neo4j')
var mongoose = require('mongoose')
var _ = require('lodash');
var async  =require("async")
var  fs = require("fs")
var db = new neo4j(
  'http://fb-hackathon:b.rFQqK9s1nX47.wpq2kglzGgEvDQpd@hobby-cjemgdgfojekgbkegdhoogpl.dbs.graphenedb.com:24789'
);
var parent_node_id = 21;
var parent_question = "This is a question";
var access_token = "EAACEdEose0cBAA4nIvD2VjSfAFkkGnXFNZCvbIaiBoRnkQZCYewWrpnrSplWo634HZAQwlEnS38flzZAhlX1FBHLWZBZAsJg6VZB7C2u6GKO8MMGeFwbnk98DN0TXuJFAlZCQfD3wEB2tFfRsfSxIhTP9sCOaEzqoVXntiT9eCk0nh9fIiVvQOgagVSyb5jaGZAwZD";
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
  color:{
    type: Number
  },
  count:{
    type: Number
  },
  created:{
    type:String,
    default:''
  }
})

var ItemModal = mongoose.model('item', Item);


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});



//formal function

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



router.get('/generate', function (req, res, next) {
    request(
        'https://graph.facebook.com/v2.9/515904358769189/comments?limits=100&access_token='+access_token,
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

            async.eachSeries(json.data, function(obj, callback){
               //var createTime = obj.created_time;
                var message = obj.message;
                db.insertNode({
                }, function (err, node) {
                  var id = node._id;
                  var color = _.random(0,1.0,true);
                  var createTime = 0;
                  var count = _.random(20,40);
                  if (err) {
                    return callback(err)
                  }else{
                        var item = {
                          user_id : '',
                          question_id : question_id,
                          node_id : id,
                          type : false,
                          message : message,
                          color: color,
                          count : count,
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


router.get('/generate_by_doc', function(req, res,next){
    fs.readFile(__dirname + '/data.json', {flag: 'r+', encoding: 'utf8'}, function (error, data) {
       // console.log(data);
          //return res.send("data");
        // 'https://graph.facebook.com/v2.9/515904358769189/comments?limits=100&access_token='+access_token,
        // function (error, response, body) {
            if(error){
              return res.send("error");
            }
            var json = JSON.parse(data);
          //  console.log(json.data);
            var question_id = req.query.q_id  == null ? parent_node_id : req.query.q_id;
            if(json == null || json.length ==null ||json.length == 0){
              return res.send("no data");
            }

            async.eachSeries(json, function(obj, callback){
               //var createTime = obj.created_time;
                var message = obj.key;
                db.insertNode({
                }, function (err, node) {
                  var id = node._id;
                  var color = obj.score;
                  var createTime = obj.time;
                  var count = obj.count;
                  if (err) {
                    return callback(err)
                  }else{
                        var item = {
                          user_id : '',
                          question_id : question_id,
                          node_id : id,
                          type : false,
                          message : message,
                          color: color,
                          count : count,
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

router.get('/live', function (req, res, next) {
    request(
        'https://graph.facebook.com/v2.9/516006922092266/comments?access_token='+ access_token,
        function (error, response, body) {
            var json = JSON.parse(body);
            console.log(json.data);
            var result_data = {};
            var color = new Array();
            color.push(_.random(0,10));
            color.push(_.random(0,10));
            color.push(_.random(0,10));
            color.push(_.random(0,10));
            color.push(_.random(0,10));
            color.push(_.random(0,10));
            var nodes = new Array();
            var node;
            node = new Node("-1","Sample centre",color,40);
            nodes.push(node);
            function Node(id,name,color,size) {
                this.id = id;
                this.name = name;
                this.color = color;
                this.size = size;
            }


            function HashMap(){
                var length = 0;
                var obj = new Object();

                this.isEmpty = function(){
                    return length == 0;
                };

                this.containsKey=function(key){
                    return (key in obj);
                };

                this.containsValue=function(value){
                    for(var key in obj){
                        if(obj[key] == value){
                            return true;
                        }
                    }
                    return false;
                };

                this.put=function(key,value){
                    if(!this.containsKey(key)){
                        length++;
                    }
                    obj[key] = value;
                };

                this.get=function(key){
                    return this.containsKey(key)?obj[key]:null;
                };

                this.remove=function(key){
                    if(this.containsKey(key)&&(delete obj[key])){
                        length--;
                    }
                };

                this.values=function(){
                    var _values= new Array();
                    for(var key in obj){
                        _values.push(obj[key]);
                    }
                    return _values;
                };

                this.keySet=function(){
                    var _keys = new Array();
                    for(var key in obj){
                        _keys.push(key);
                    }
                    return _keys;
                };

                this.size = function(){
                    return length;
                };

                this.clear = function(){
                    length = 0;
                    obj = new Object();
                };
            }

            var msgMap = new HashMap();
            for(i=0;i<json.data.length;i++) {
                var message = json.data[i].message;
                console.log(message);
                var color = new Array();
                color.push(_.random(0,10));
                color.push(_.random(0,10));
                color.push(_.random(0,10));
                color.push(_.random(0,10));
                color.push(_.random(0,10));
                color.push(_.random(0,10));
                if(!msgMap.containsKey(message)) {
                    node = new Node(i,message,color,20);
                    nodes.push(node);
                    msgMap.put(message,i);
                } else {
                    var id = msgMap.get(message);
                    var size = nodes[id].size;
                    console.log(size);
                    msgMap.remove(message);
                    msgMap.put(message, id);
                    node[id] = new Node(id,message,color,parseInt(size) +5);

                }
        }

        function Relation(id_1,id_2) {
            this.id_1 = id_1;
            this.id_2 = id_2;
        }

        var relationship = new Array();
        for(i=1;i<nodes.length;i++) {
            relationship.push(new Relation("-1", nodes[i].id));
        }

            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body) // Print the HTML for the Google homepage.
            result_data["nodes"] = nodes;
            result_data["relationship"] = relationship;
            res.send(result_data);
        }
    )
});
router.get('/change', function(req,res,next){

});

router.get('/getdata', function(req, res, next){

    var question_id = req.query.q_id  == null ? parent_node_id : req.query.q_id;
    var sql_root = 'MATCH (s) WHERE ID(s) = '+question_id+' MATCH (s)-[:Answer]->(m) return m';
    console.log(sql_root);
    // var sql_child = 'Match(n:Children) return n';
   
    db.cypherQuery(sql_root, function (err, result) {
        // var times = req.query.times  == null ? null : 
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
                  //
                  var size  = 40;
                  var tmp = {
                       id : id,
                       name: name,
                       color : color,
                       size: size
                     }
                     node.push(tmp);
                 
                  for(var i = 0; i < result.length; i++){
                    if(req.query.times != null &&  result[i]["created"] != req.query.times ){
                      
                    }else{
                      var id = result[i]["node_id"];
                    var name = result[i]["message"];
                     var color = new Array();
                      color.push(0);
                      color.push(255*result[i]["color"])
                      color.push(0);
                      color.push(0);
                      color.push(0);
                      color.push(255 - 255*result[i]["color"])
                    
                    var size  = result[i]["count"];
                    
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


module.exports = router;
