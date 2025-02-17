var express = require('express');
var router = express.Router();
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('data/userData.json');
var app = require('../app');

router.post('/',function(req,res) {
    if (app.database == undefined) {
        app.database = low(adapter);
    }
    var condition = 0;
    var user = app.database.get( "users" )
    .find({"username": app.theUser.username});
    user.get("games")
    .push(req.body)
    .write()

    if (user.get("highscore").value() < req.body.score) {
        user.set("highscore", req.body.score)
        .write()
        condition = 1;
    }
    res.json({"condition": condition})
});

router.get('/',function(req,res){
    if (app.database == undefined) {
        app.database = low(adapter);
    }
    res.json(app.database.get("users").find({"username":app.theUser.username}).value());
})
router.get('/highscore',function(req,res){
    if (app.database == undefined) {
        app.database = low(adapter);
    }
    res.json(app.database.get("users").find({"username":app.theUser.username}).get("highscore").value());
})

module.exports = router;