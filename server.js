'use strict';

var express = require("express");
require("node-env-file")(".env");
var routes = require("./app/routes/index.js");
var app = express();

app.use("/public", express.static(process.cwd() + '/public'));

routes(app);

app.listen(process.env.PORT, function () {
	console.log("App listening on port " + process.env.PORT + "...");	
});