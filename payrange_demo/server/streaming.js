/**
 * New node file
 */
var util = require("util");
var queueModule = require('./queue.js');
var datasourceModule = require('./datasource.js');


/**
 *
 * timestamp: { type: Date },
 vendingmachine: { type: String },
 user: { type: String },
 city: { type: String },
 product: { type: String },
 expense: { type: Number },
 timespent: { type: Number }
 *
 *
 * @type {number}
 */




var index = 0;

exports.receiveDataStreams = function receiveDataStreams(payRangeEventSender) {
    var payRangeInfo = {
        timestamp: datasourceModule.getTimeStamp(index),
        vendingmachine: datasourceModule.getVendingMachine(index),
        user: datasourceModule.getUser(index),
        city: datasourceModule.getCity(index),
        product: datasourceModule.getProduct(index),
        expense: datasourceModule.getExpense(index),
        timespent: datasourceModule.getTimeSpent(index)
    };
    util.debug("sending payrange event: " + JSON.stringify(payRangeInfo));
    if (typeof payRangeInfo.vendingmachine != 'undefined') {
        // Publish message to Redis Client
        queueModule.publishMessage(payRangeInfo);
    }
    // Simulating Real-Time Streaming
    var timeout = Math.round(Math.random() * 12000);
    if (timeout < 3000) {
        timeout += 10000;
    }
    index++;
    if (index == datasourceModule.getSampleData().length) {
        index = 0;
    }
    util.debug("Got an event");
    payRangeEventSender = setTimeout(receiveDataStreams, timeout);

};
                   