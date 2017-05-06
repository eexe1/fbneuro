/**
 * Created by Evan on 2017/5/6.
 */
var express = require('express');
var router = express.Router();

var neo4j = require('node-neo4j');
var db = new neo4j('http://fb-hackathon:b.rFQqK9s1nX47.wpq2kglzGgEvDQpd@hobby-cjemgdgfojekgbkegdhoogpl.dbs.graphenedb.com:24789');

router.get('/', function(req, res, next) {

    // db.cypherQuery("START user = node(123) MATCH user-[:RELATED_TO]->friends RETURN friends", function(err, result){
    //     if(err) throw err;
    //
    //     console.log(result.data); // delivers an array of query results
    //     console.log(result.columns); // delivers an array of names of objects getting returned
    // });


    res.json({ "name" : "John", "" });
});
module.exports = router;