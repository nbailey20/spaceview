'use strict';

module.exports = function (app, db) {
    var passport = require("passport");
    
    app.route("/")
        .get(function (req, res) {
            res.sendFile(process.cwd() + "/public/index.html"); 
        });
        
    app.route("/all")
        .post(function (req, res) {
            var images = db.collection("images");
            images.find().toArray(function (err, docs) {
                if (err) console.log("Error pulling All pics");
               res.send(docs); 
            });
        });
        
    app.route("/my")
        .get(function (req, res) {
             res.sendFile(process.cwd() + "/public/myPics.html");
        })
        .post(function (req, res) {
            var userID = req.user.twitterid;
            var images = db.collection("images");
            images.find({postedby: userID}).toArray(function (err, docs) {
                if (err) console.log("Error pulling My pics");
                console.log(JSON.stringify(docs));
               res.send(docs); 
            });
        });
    
    app.route("/add")
        .post(function (req, res) {
            var userID = req.user.twitterid;
            var userLogo = req.user.logo;
            console.log(JSON.stringify(req.body));
            var images = db.collection("images");
            images.insert({
                url: req.body["add-url"], 
                descrip: req.body["add-descrip"], 
                postedby: userID, 
                postedLogo: userLogo, 
                likedby: []
            });
            res.redirect("/");
        });
        
    app.get('/auth', passport.authenticate('twitter'));
	
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }));
                                     
    app.get("/logout", function (req, res) {
        req.logout();
		res.redirect('/');
    });
    
    app.post("/user", function (req, res) {
        res.send(req.user);
    });
    
    
    app.get("/delete", function (req, res) {
       var users = db.collection("clients");
       users.drop();
       var images = db.collection("images");
       images.drop();
       res.send("done");
    });
};
