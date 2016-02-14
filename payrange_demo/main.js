
/**
 * Module dependencies.
 */
var express = require('express');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var sys     = require("sys");
var util     = require("util");
require('./server/globals.js');
dbModule = require('./server/db.js');
var queueModule= require('./server/queue.js');
var streamingModule = require('./server/streaming.js');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}

var httpServer = http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});

var io  = require("socket.io").listen(httpServer);
var payRangeEventSender;

////////////////////////

queueModule.listenForIncomingMessages(io);

/////////////////////////////////

app.get("/", function(req, resp) {
    resp.render("home", {
       pageTitle: "Pay Range Data Analytics"
    });
});

/////////////////////////////////////

app.get("/vendingmachinesummary/:name", function(req, resp) {
	dbModule.findVendingMachineSummary(req.params.name, resp);
});

/////////////////////////////////

app.get("/productstats/:name", function(req, resp) {
	dbModule.findProductStats(req.params.name, resp);
});

/////////////////////////////////
app.get("/userstats/:name", function(req, resp) {
	dbModule.findUserStats(req.params.name, resp);
});
/////////////////////////////////

app.get("/vendingstats/:name", function(req, resp) {
	dbModule.findVendingMachineStats(req.params.name, resp);
});
/////////////////////////////////



io.sockets.on('connection', function (socket) {
	if(!payRangeEventSender) {
		streamingModule.receiveDataStreams();
	}
    util.debug("connection made..." + httpServer);
});

httpServer.listen(app.get('port'));