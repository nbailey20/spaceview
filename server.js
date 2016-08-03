'use strict';

var express = require("express");
var session = require("express-session");
require("node-env-file")(".env");
var mongo = require("mongodb").MongoClient;
var bodyParser = require("body-parser");
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
var routes = require("./app/routes/index.js");
var app = express();

mongo.connect(process.env.MONGO_URI, function (err, db) {
	app.use("/public", express.static(process.cwd() + '/public'));
	app.use("/controllers", express.static(process.cwd() + '/app/controllers'));
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(session({ secret: process.env.SESS_SECRET }));
	app.use(passport.initialize());
	app.use(passport.session());
	
	passport.use('twitter', new TwitterStrategy({
	    consumerKey: process.env.TWITTER_CONSUMER_KEY,
		consumerSecret: process.env.TWITTER_CONSUMER_SECRET,					
	    callbackURL: process.env.APP_URL + "auth/twitter/callback"
	  },
	  function(token, tokenSecret, profile, done) {
	  	var Users = db.collection("clients");
	    Users.findOne({ twitterid: profile.id }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                user = {
                	twitterid: profile.id,
                    logo: profile["_json"].profile_image_url_https
                };
                Users.insert({twitterid: user.twitterid, logo: user.logo});
                return done(err, user);
                }
            else {
                return done(err, user);
            }
        });
	  }
	));
	
	passport.serializeUser(function(user, done) {  
    	done(null, user.twitterid);
	});

	passport.deserializeUser(function(id, done) {  
		var Users = db.collection("clients");
    	Users.findOne({ twitterid: id }, function (err, user) {
    		console.log(user);
        	done(err, user);
    	});
	});

	routes(app, db);
	
	app.listen(process.env.PORT, function () {
		console.log("App listening on port " + process.env.PORT + "...");	
	});
});
