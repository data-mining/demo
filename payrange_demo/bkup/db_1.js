/**
 * New node file
 */
var util = require("util");
var datasourceModule = require('./datasource.js');

//MongoDB
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

//Mongoose Models --> 
var safe_params = {j: 1, w: 1, wtimeout: 10000};

var PayRangeDetailsSchema = new Schema({
    timestamp: {type: Date},
    vendingmachine: {type: String},
    user: {type: String},
    city: {type: String},
    product: {type: String},
    expense: {type: Number},
    timespent: {type: Number}
}, {safe: safe_params});
mongoose.model('PayRangeEvent', PayRangeDetailsSchema);


var VendingMachineSummarySchema = new Schema({
    vendingmachine: {type: String},
    totalSales: {type: Number}
}, {safe: safe_params});
mongoose.model('VendingSummary', VendingMachineSummarySchema);

var ProductSummarySchema = new Schema({
    product: {type: String},
    totalSales: {type: Number}
}, {safe: safe_params});
mongoose.model('ProductSummary', ProductSummarySchema);

var UserSummarySchema = new Schema({
    totalPayments: {type: String},
    totalTimeSpent: {type: Number}
}, {safe: safe_params});
mongoose.model('UserSummary', UserSummarySchema);

///////////////////////////////////////////////////

var mongoConfig = config.properties.mongo;
var db = mongoose.createConnection("mongodb://" + mongoConfig.username + ":" + mongoConfig.password + "@" + mongoConfig.hostname + ":" + mongoConfig.port + "/" + mongoConfig.db);
var mongooseTypes = require("mongoose-types")
    , useTimestamps = mongooseTypes.useTimestamps;
PayRangeDetailsSchema.plugin(useTimestamps);
VendingMachineSummarySchema.plugin(useTimestamps);

////////////////////////////////

var vending_total_sales = 0;
var product_total_sales = 0;
var user_total_payment = 0;
var user_total_time = 0;  // in secs

exports.persistPayRangeEvent = function persistPayRangeEvent(json) {
    var VendingSummary = db.model('VendingSummary', 'vendingsummary');
    var PayRangeEvent = db.model('PayRangeEvent', 'payrangedetails');

    util.debug("<================ START ===============>");
    util.debug("Incoming data ... " + json);
    var data = JSON.parse(json);
    util.debug("Parsed data ... " + data);

    PayRangeEvent.count({}, function (err, count) {
        util.debug("Records Count:", count);

        if (count < datasourceModule.getSampleData().length) {
            var te = new PayRangeEvent({
                timestamp: data.timestamp,
                vendingmachine: data.vendingmachine,
                user: data.user,
                city: data.city,
                product: data.product,
                expense: data.expense,
                timespent: data.timespent
            });

            te.save(function (err) {
                if (err) {
                    throw(err);
                }
                util.debug("Step 1 : Got a Stock Symbol.." + JSON.stringify(data));
                util.debug(te.createdAt); // Should be approximately now


                // effectively fire 4 asynchronous parallel calls using nodejs async module
                ////////////// Step 1 - calculate Max
                PayRangeEvent.find({vendingmachine: data.vendingmachine}).sort({expense: -1}).limit(1).exec(function (err, doc1) {
                    if (doc1) {
                        util.debug(" Got Document1 " + doc1[0] + " for symbol " + data.vendingmachine);
                        vending_total_sales = doc1[0].expense;
                        util.debug(" Got Max Val : " + vending_total_sales);

                        //////// Step 4 - calculate Summary
                        VendingSummary.find({vendingmachine: data.vendingmachine}).limit(1).exec(function (err, doc3) {
                            if (!err) {
                                util.debug("Found Summary " + doc3[0]);
                            } else {
                                util.debug("Error: could not find Summary for " + data.vendingmachine);
                            }
                            if (!doc3 || doc3.length == 0) {
                                util.debug("Event : Create new Summary document ");
                                var summaryDoc = new VendingSummary();
                                summaryDoc.vendingmachine = data.vendingmachine;
                                summaryDoc.totalSales = vending_total_sales;

                                summaryDoc.save(function (err) {
                                    if (err) {
                                        throw(err);
                                    }
                                });
                            } else {
                                doc3[0].vendingmachine = data.vendingmachine;
                                doc3[0].totalSales = vending_total_sales;
                                doc3[0].save();

                                util.debug("Step 4 : Saved the summary.." + JSON.stringify(doc3[0]));
                            }
                            util.debug("<================ END ===============>");

                        }); // End of Summary Calculation
                    }
                });	// End of Max Calculation
            });// End of Save Operation
            //===============================>

        }
    });// End of Count Operation
};

//////////

exports.findVendingMachineSummary = function findVendingMachineSummary(symbol, resp) {

    /*mongoose.connection.on("open", function(){
     util.debug("mongodb is connected!!");
     });*/
    util.debug("<<======  SUMMARY  ======>>");
    util.debug("found symbol ..." + symbol);

    var VendingSummary = db.model('VendingSummary', 'vendingsummary');
    util.debug("Found VendingSummary");
    var PayRangeEvent = db.model('PayRangeEvent', 'payrangedetails');
    util.debug("Found PayRangeEvent");
    VendingSummary.findOne({"vendingmachine": symbol}, function (err, summarydata) {
        if (err) {
            throw(err);
        } else {
            util.debug("Good data >> " + summarydata);
        }
        if (!summarydata) {
            util.debug("Data undefined " + summarydata);
        } else {
            util.debug("Found it!! " + summarydata);
            //var summaryDataJson = JSON.stringify(summarydata);
            //util.debug("Event 3 : Got the Summary " + summaryDataJson);

            PayRangeEvent.find({"payrangedetails": symbol},
                function (err, chartdata) {
                    if (err) {
                        throw(err);
                    }
                    //var chartDataJson = JSON.stringify(chartdata);
                    //util.debug("Complete data set ..."+ JSON.stringify({summary: summaryDataJson, chartdata: chartDataJson}));

                    summaryDataJson = JSON.stringify({summary: summarydata, chartData: chartdata});
                    util.debug(" Complete data set ..." + summaryDataJson);

                    resp.send(summaryDataJson);
                });


        }
    });
};
////////////////////////