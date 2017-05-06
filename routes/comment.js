var express = require('express');
var router = express.Router();
var request = require('request');
var neo4j = require('node-neo4j')
var mongoose = require('mongoose')
var _ = require('lodash');
var async = require("async")
var fs = require("fs")
var db = new neo4j(
    'http://fb-hackathon:b.rFQqK9s1nX47.wpq2kglzGgEvDQpd@hobby-cjemgdgfojekgbkegdhoogpl.dbs.graphenedb.com:24789'
);
var parent_node_id = 735;
var parent_question = "Live";
var access_token = "EAACEdEose0cBAP81eobd6uzsAe1PXnxoOfP9YVC68fvZCiXswYNVGZArrjc3kB5Lx5A2rzbyJp5pDUAem3CkEu3VwkN6yDQ0ydFr7gZCCJj8rCQMJy20Xo7NfOcvUBCy1vqdFPM6TDP5wtvgZBjoXI74LlCsRpa5ZCOZBCcx62XtKMQ1JRXq74RnfWkk201TMZD";
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
    type: {
        type: Boolean
    },
    message: {
        type: String,
        default: ''
    },
    node_id: {
        type: String,
        default: ''
    },
    color: {
        type: Number
    },
    count: {
        type: Number
    },
    created: {
        type: String,
        default: ''
    }
})

var ItemModal = mongoose.model('item', Item);

function HashMap() {
    var length = 0;
    var obj = new Object();

    this.isEmpty = function () {
        return length == 0;
    };

    this.containsKey = function (key) {
        return (key in obj);
    };

    this.containsValue = function (value) {
        for (var key in obj) {
            if (obj[key] == value) {
                return true;
            }
        }
        return false;
    };

    this.put = function (key, value) {
        if (!this.containsKey(key)) {
            length++;
        }
        obj[key] = value;
    };

    this.get = function (key) {
        return this.containsKey(key) ? obj[key] : null;
    };

    this.remove = function (key) {
        if (this.containsKey(key) && (delete obj[key])) {
            length--;
        }
    };

    this.values = function () {
        var _values = new Array();
        for (var key in obj) {
            _values.push(obj[key]);
        }
        return _values;
    };

    this.keySet = function () {
        var _keys = new Array();
        for (var key in obj) {
            _keys.push(key);
        }
        return _keys;
    };

    this.size = function () {
        return length;
    };

    this.clear = function () {
        length = 0;
        obj = new Object();
    };
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


//formal function

router.get("/cleardb", function (req, res, next) {
    //
    var sql_root = 'MATCH (s),(s)-[r:Answer]->(k) WHERE ID(s) = ' + parent_node_id + ' DELETE r';
    db.cypherQuery(sql_root, function (err, result) {
        if (err) {
            res.status(404).send("delete fail");
        } else {
            ItemModal.remove({}, function (err, result) {
                if (err) {
                    res.status(404).send("fail to delete mongodb");
                } else {
                    res.status(200).send("success");
                }
            });
            // res.json(json);
        }
    })
});


router.get('/generate', function (req, res, next) {
    request(
        'https://graph.facebook.com/v2.9/515904358769189/comments?limits=100&access_token=' + access_token,
        function (error, response, body) {
            if (error) {
                return res.send("error");
            }
            var json = JSON.parse(body);
            // console.log(json.data);
            var question_id = req.query.q_id == null ? parent_node_id : req.query.q_id;
            if (json == null || json.data == null || json.data.length == 0) {
                return res.send("no data");
            }

            async.eachSeries(json.data, function (obj, callback) {
                //var createTime = obj.created_time;
                var message = obj.message;
                db.insertNode({}, function (err, node) {
                    var id = node._id;
                    var color = _.random(0, 1.0, true);
                    var createTime = 0;
                    var count = _.random(20, 40);
                    if (err) {
                        return callback(err)
                    } else {
                        var item = {
                            user_id: '',
                            question_id: question_id,
                            node_id: id,
                            type: false,
                            message: message,
                            color: color,
                            count: count,
                            created: createTime
                        }

                        ItemModal.create(item, (err, docs) => {
                            if (err) {
                                callback(err);
                            } else {
                                var sql_child = "MATCH (s),(m) WHERE ID(s) = " + question_id + " AND ID(m) = " + id + " CREATE (s)-[r:Answer]->(m) return s,m,r"
                                // var sql_child = "MATCH (a { ID: '"++"' }), (b { ID: '"+id+"' }) CREATE (a)-[:Answer]->(b)";
                                console.log(sql_child);
                        db.cypherQuery(sql_child, function (err, result) {
                            if (err) {
                                callback(err);
                            } else {
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
            }, function done(err) {
                if (err) {
                    res.send(err);
                } else {
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
router.get('/generate_by_doc1', function (req, res, next) {
    fs.readFile(__dirname + '/data.json', {flag: 'r+', encoding: 'utf8'}, function (error, data) {
            // console.log(data);
            //return res.send("data");
            // 'https://graph.facebook.com/v2.9/515904358769189/comments?limits=100&access_token='+access_token,
            // function (error, response, body) {
            if (error) {
                return res.send("error");
            }
            var json = JSON.parse(data);
            //  console.log(json.data);
            var question_id = req.query.q_id == null ? parent_node_id : req.query.q_id;
            if (json == null || json.length == null || json.length == 0) {
                return res.send("no data");
            }

            async.eachSeries(json, function (obj, callback) {
                //var createTime = obj.created_time;
                  var message = obj.key;
                // db.insertNode({}, function (err, node) {
                    var id = ""
                    var color = obj.score;
                    var createTime = obj.time;
                    var count = obj.count;
                    // if (err) {
                    //     return callback(err)
                    // } else {
                        var item = {
                            user_id: '',
                            question_id: question_id,
                            node_id: id,
                            type: false,
                            message: message,
                            color: color,
                            count: count,
                            created: createTime
                        }

                        ItemModal.create(item, (err, docs) => {
                            if (err) {
                                callback(err);
                            } else {
                              callback(null);
                            }
                        })
                    // }
                // });
            }, function done(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send({});
                }
            });
        }
    )
});

router.get('/generate_by_doc', function (req, res, next) {
    fs.readFile(__dirname + '/data.json', {flag: 'r+', encoding: 'utf8'}, function (error, data) {
            // console.log(data);
            //return res.send("data");
            // 'https://graph.facebook.com/v2.9/515904358769189/comments?limits=100&access_token='+access_token,
            // function (error, response, body) {
            if (error) {
                return res.send("error");
            }
            var json = JSON.parse(data);
            //  console.log(json.data);
            var question_id = req.query.q_id == null ? parent_node_id : req.query.q_id;
            if (json == null || json.length == null || json.length == 0) {
                return res.send("no data");
            }

            async.eachSeries(json, function (obj, callback) {
                //var createTime = obj.created_time;
                var message = obj.key;
                db.insertNode({}, function (err, node) {
                    var id = node._id;
                    var color = obj.score;
                    var createTime = obj.time;
                    var count = obj.count;
                    if (err) {
                        return callback(err)
                    } else {
                        var item = {
                            user_id: '',
                            question_id: question_id,
                            node_id: id,
                            type: false,
                            message: message,
                            color: color,
                            count: count,
                            created: createTime
                        }

                        ItemModal.create(item, (err, docs) => {
                            if (err) {
                                callback(err);
                            } else {
                                var sql_child = "MATCH (s),(m) WHERE ID(s) = " + question_id + " AND ID(m) = " + id + " CREATE (s)-[r:Answer]->(m) return s,m,r"
                                // var sql_child = "MATCH (a { ID: '"++"' }), (b { ID: '"+id+"' }) CREATE (a)-[:Answer]->(b)";
                                console.log(sql_child);
                                db.cypherQuery(sql_child, function (err, result) {
                                    if (err) {
                                        callback(err);
                                    } else {
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
            }, function done(err) {
                if (err) {
                    res.send(err);
                } else {
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
        'https://graph.facebook.com/v2.9/516006922092266/comments?access_token=' + access_token,
        function (error, response, body) {
            var json = JSON.parse(body);
            console.log(json.data);
            var result_data = {};
            var color = new Array();
            color.push(0);
            color.push(_.random(0, 255));
            color.push(0);
            color.push(_.random(0, 255));
            color.push(0);
            color.push(_.random(0, 255));
            var nodes = new Array();
            var parentnode;
            parentnode = new Node("-1", "Sample centre", color, 40);
            nodes[0] = parentnode;
            //nodes.push(node);
            function Node(id, name, color, size) {
                this.id = id;
                this.name = name;
                this.color = color;
                this.size = size;
            }

            var i;
            var msgMap = new HashMap();
            for (i = 0; i < json.data.length; i++) {
                const message = json.data[i].message;
                // console.log(message);
                var color = new Array();
                color.push(0);
                color.push(_.random(0, 255));
                color.push(0);
                color.push(_.random(0, 255));
                color.push(0);
                color.push(_.random(0, 255));
                if (!msgMap.containsKey(message)) {
                    var node = new Node(i+1, message, color, 20);
                    nodes[i+1] = node;
                    msgMap.put(message, i+1);
                } else {
                    // console.log(i+1);
                    console.log(message);
                    const id = msgMap.get(message);
                    // console.log("size: " + nodes.length + "id: " + id);
                    var size = nodes[id].size;
                    msgMap.remove(message);
                    msgMap.put(message, i+1);
                    nodes[id] = new Node(id, message, color, parseInt(size) + 5);

                }
            }


            function Relation(id_1, id_2) {
                this.id_1 = id_1;
                this.id_2 = id_2;
            }

            var relationship = new Array();
            for (i = 1; i < nodes.length; i++) {
                if(nodes[i]==undefined) {
                    i++;
                }
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

router.get('/like', function (req, res, next) {
    request(
        'https://graph.facebook.com/v2.9/516006922092266/comments?fields=reactions&access_token=' + access_token,
        function (error, response, body) {
            var json = JSON.parse(body);
            // console.log(json.data);
            var emoMap = new HashMap();
            for(i=0;i<json.data.length;i++) {
                if(json.data[i].reactions!=undefined) {
                    // console.log(json.data[i].reactions.data);
                    var emotion = json.data[i].reactions.data[0].type;
                    // console.log(emotion);
                    if(emoMap.containsKey(emotion)) {
                        var count = emoMap.get(emotion);
                        emoMap.remove(emotion);
                        emoMap.put(emotion, count+1);
                    } else {
                        emoMap.put(emotion, 1);
                    }
                }
            }

            function Emotion(emotion,count) {
                this.emotion = emotion;
                this.count = count;
            }


            var emotions = new Array();
            var keys = emoMap.keySet();
            // console.log(keys);
            for(i=0;i<keys.length;i++) {
                var emotion = new Emotion(keys[i], emoMap.get(keys[i]));
                emotions.push(emotion);
                console.log(emotion);
            }

            var result_data = JSON.stringify(emotions);
            console.log(result_data);

            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body) // Print the HTML for the Google homepage.
            res.send(result_data);
        }
    )
});

router.get('/change', function (req, res, next) {

});

router.get('/getdata', function (req, res, next) {

    var question_id = req.query.q_id == null ? parent_node_id : req.query.q_id;
    var sql_root = 'MATCH (s) WHERE ID(s) = ' + question_id + ' MATCH (s)-[:Answer]->(m) return m';
    console.log(sql_root);
    // var sql_child = 'Match(n:Children) return n';

    db.cypherQuery(sql_root, function (err, result) {
        // var times = req.query.times  == null ? null : 
        if (err) {
            res.status(404).send(result);
        } else {
            // res.send(result);
            // res.json(result);
            if (result != null) {
                var json = result;//JSON.parse(result);
                var data = json.data;
                if (json == null || data == null) {
                    res.status(404).send({});
                }
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push(data[i]["_id"]);
                }
                ItemModal.find({"node_id": {"$in": arr}}, function (err, result) {

                    if (err) {
                        res.status(404).send({});
                    } else {

                        var result_data = {};
                        var node = new Array();
                        var relationship = new Array();
                        //parent_node
                        /*
                         */
                        var id = parent_node_id;
                        var name = parent_question;
                        var color = new Array();
                        color.push(0);
                        color.push(_.random(0, 255));
                        color.push(0);
                        color.push(_.random(0, 255));
                        color.push(0);
                        color.push(_.random(0, 255));
                        //
                        var size = 40;
                        var tmp = {
                            id: id,
                            name: name,
                            color: color,
                            size: size
                        }
                        node.push(tmp);

                        for (var i = 0; i < result.length; i++) {
                            // console.log(result.length);
                            if (result[i]["created"] != req.query.times) {
                                console.log(result[i]);
                            } else {
                                console.log("test");
                                var id = result[i]["node_id"];
                                var name = result[i]["message"];
                                var color = new Array();
                                var r = 214, g = 90, b = 103;
                                if (result[i]["color"] >= 0 && result[i]["color"] <= 0.1) {

                                }
                                else if (result[i]["color"] > 0.1 && result[i]["color"] <= 0.2) {
                                    r = 214;
                                    g = 90;
                                    b = 103;
                                } else if (result[i]["color"] > 0.2 && result[i]["color"] <= 0.3) {
                                    r = 216;
                                    g = 98;
                                    b = 103;

                                } else if (result[i]["color"] > 0.3 && result[i]["color"] <= 0.4) {
                                    r = 218;
                                    g = 106;
                                    b = 103;

                                } else if (result[i]["color"] > 0.4 && result[i]["color"] <= 0.5) {
                                    r = 220;
                                    g = 114;
                                    b = 103;

                                } else if (result[i]["color"] > 0.5 && result[i]["color"] <= 0.6) {
                                    r = 222;
                                    g = 122;
                                    b = 103;

                                } else if (result[i]["color"] > 0.6 && result[i]["color"] <= 0.7) {
                                    r = 224;
                                    g = 130;
                                    b = 103;

                                } else if (result[i]["color"] > 0.7 && result[i]["color"] <= 0.8) {
                                    r = 226;
                                    g = 138;
                                    b = 103;

                                } else if (result[i]["color"] >= 0.8 && result[i]["color"] <= 0.9) {
                                    r = 230;
                                    g = 154;
                                    b = 103;
                                } else if (result[i]["color"] >= 0.9) {
                                    r = 232;
                                    g = 162;
                                    b = 103;

                                }
                                color.push(0);
                                color.push(r);
                                color.push(0);
                                color.push(g);
                                color.push(0);
                                color.push(b);

                                var size = result[i]["count"];

                                var tmp = {
                                    id: id,
                                    name: name,
                                    color: color,
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

            } else {
                res.status(200).send({});
            }
        }
        // json.name = result.data.name
        // console.log(result)

    })
})

router.get('/getdata1', function (req, res, next) {
    var question_id = req.query.q_id == null ? parent_node_id : req.query.q_id;
    var condition = {};
    if ( req.query.times != null) {
      var condition = {created : req.query.times}
    }else{
      var condition = {};
    }
    console.log(condition);
    ItemModal.find(condition, function (err, result) {
                  if (err) {
                        res.status(404).send({});
                    } else {

                        var result_data = {};
                        var node = new Array();
                        var relationship = new Array();
                        //parent_node
                        /*
                         */
                        var id = parent_node_id;
                        var name = parent_question;
                        var color = new Array();
                        color.push(_.random(0, 10));
                        color.push(_.random(0, 10));
                        color.push(_.random(0, 10));
                        color.push(_.random(0, 10));
                        color.push(_.random(0, 10));
                        color.push(_.random(0, 10));
                        //
                        var size = 40;
                        var tmp = {
                            id: id,
                            name: name,
                            color: color,
                            size: size
                        }
                        node.push(tmp);

                        for (var i = 0; i < result.length; i++) {
                                var id = i;
                                var name = result[i]["message"];
                                var color = new Array();
                                var r = 214, g = 90, b = 103;
                                result[i]["color"]  = result[i]["color"] *2;
                                if (result[i]["color"] >= 0 && result[i]["color"] <= 0.1) {

                                }
                                else if (result[i]["color"] > 0.1 && result[i]["color"] <= 0.2) {
                                    r = 214;
                                    g = 90;
                                    b = 103;
                                } else if (result[i]["color"] > 0.2 && result[i]["color"] <= 0.3) {
                                    r = 216;
                                    g = 98;
                                    b = 103;

                                } else if (result[i]["color"] > 0.3 && result[i]["color"] <= 0.4) {
                                    r = 218;
                                    g = 106;
                                    b = 103;

                                } else if (result[i]["color"] > 0.4 && result[i]["color"] <= 0.5) {
                                    r = 220;
                                    g = 114;
                                    b = 103;

                                } else if (result[i]["color"] > 0.5 && result[i]["color"] <= 0.6) {
                                    r = 222;
                                    g = 122;
                                    b = 103;

                                } else if (result[i]["color"] > 0.6 && result[i]["color"] <= 0.7) {
                                    r = 224;
                                    g = 130;
                                    b = 103;

                                } else if (result[i]["color"] > 0.7 && result[i]["color"] <= 0.8) {
                                    r = 226;
                                    g = 138;
                                    b = 103;

                                } else if (result[i]["color"] >= 0.8 && result[i]["color"] <= 0.9) {
                                    r = 230;
                                    g = 154;
                                    b = 103;
                                } else if (result[i]["color"] >= 0.9) {
                                    r = 232;
                                    g = 162;
                                    b = 103;

                                }
                                color.push(0);
                                color.push(r);
                                color.push(0);
                                color.push(g);
                                color.push(0);
                                color.push(b);

                                var size = result[i]["count"];

                                var tmp = {
                                    id: id,
                                    name: name,
                                    color: color,
                                    size: size

                                }

                                var relation = {
                                    id_1: question_id,
                                    id_2: id
                                }

                                node.push(tmp);
                                relationship.push(relation);

                            // }

                        }
                        result_data["nodes"] = node;
                        result_data["relationship"] = relationship;
                        res.status(200).send(result_data);
                      }


    })
})
module.exports = router;
