'use strict';

module.exports = function (app, db) {
    var passport = require("passport");
    var ObjectId = require("mongodb").ObjectId;
    
    
    app.route("/")
        .get(function (req, res) {
            res.sendFile(process.cwd() + "/public/index.html"); 
        });
        
        
    app.route("/all")
        .post(function (req, res) {
            var images = db.collection("images");
            images.find().toArray(function (err, docs) {
                if (err) console.log("Error pulling All pics");
                var obj = {docs: docs, user: req.user};
                res.send(obj); 
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
                var obj = {docs: docs, user: req.user};
                res.send(obj); 
            });
        });
    
    
    app.post("/add", function (req, res) {
            var userID = req.user.twitterid;
            var userLogo = req.user.logo;
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
        
        
    app.post("/delete", function (req, res) {
        var picID = req.body.id;
        var images = db.collection("images");
        images.remove({"_id": ObjectId(picID)});
        res.send("ok");
    });
        
        
    app.get('/auth', passport.authenticate('twitter'));
	
	
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }));
          
                                     
    app.get("/logout", function (req, res) {
        req.logout();
		res.redirect('/');
    });
    
    app.post("/like", function (req, res) {
        var images = db.collection("images");
        var numlikes;
        images.find({"_id": ObjectId(req.body.id)}).toArray(function (err, docs) {
            docs[0].likedby.forEach(function (element) {
                
                // if user already liked image, unlike it
                if (element == req.user.twitterid) {
                    images.update({"_id": ObjectId(req.body.id)}, {$pull: {likedby: req.user.twitterid}});
                    numlikes = "" + eval(docs[0].likedby.length-1) + "";
                    res.send(numlikes);
                    return;
                } 
                
                // otherwise like the image, assuming list length isn't 0
                if (element == docs[0].likedby[docs[0].likedby.length-1]) {
                    images.update({"_id": ObjectId(req.body.id)}, {$push: {likedby: req.user.twitterid}});
                    numlikes = "" + eval(docs[0].likedby.length+1) + "";
                    res.send(numlikes);
                    return;
                }
            });
            
            // like image if nobody likes it, couldn't have previously liked it
            if (docs[0].likedby.length === 0) {
                images.update({"_id": ObjectId(req.body.id)}, {$push: {likedby: req.user.twitterid}});
                numlikes = "" + eval(docs[0].likedby.length+1) + "";
                res.send(numlikes);
                return;
            }
        });
    });
    
    
    app.post("/user", function (req, res) {
        res.send(req.user);
    });
    
    
    
    app.get("/badbad", function (req, res) {
       var users = db.collection("clients");
       users.drop();
       var images = db.collection("images");
       images.drop();
       res.send("done");
    });
};
