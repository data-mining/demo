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
    user: {type: String},
    totalPayments: {type: Number},
    totalTimeSpent: {type: Number}
}, {safe: safe_params});
mongoose.model('UserSummary', UserSummarySchema);

///////////////////////////////////////////////////

var mongoConfig = config.properties.mongo;
var db = mongoose.createConnection("mongodb://" + mongoConfig.username + ":" + mongoConfig.password + "@" + mongoConfig.hostname + ":" + mongoConfig.port + "/" + mongoConfig.db);
var mongooseTypes = require("mongoose-types")
    , useTimestamps = mongooseTypes.useTimestamps;

PayRangeDetailsSchema.plugin(useTimestamps);

//var vending_total_sales = 0;
//var product_total_sales = 0;
//var user_total_payment = 0;
//var user_total_time = 0;  // in secs

exports.persistPayRangeEvent = function persistPayRangeEvent(json) {

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

                preAggregateVendingSummary(data);
                preAggregateProductSummary(data);
                preAggregateUserSummary(data);

            });// End of Save Operation
            //===============================>

        }
    });// End of Count Operation
};


//////  SEARCH   //////////////////////////
exports.findVendingMachineSummary = function findVendingMachineSummary(symbol, resp) {

    mongoose.connection.on("open", function(){
        util.debug("mongodb is connected!!");
    });
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

            PayRangeEvent.find({"vendingmachine": symbol},
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


//////
exports.findVendingMachineStats = function findVendingMachineStats(symbol, resp) {
    util.debug("<<======  SUMMARY  ======>>");
    util.debug("found symbol ..." + symbol);

    var VendingSummary = db.model('VendingSummary', 'vendingsummary');
    util.debug("Found VendingSummary");

    VendingSummary.find({}, function (err, summarydata) {
        if (err) {
            throw(err);
        } else {
            //util.debug("Good data >> " + summarydata);
        }
        if (!summarydata) {
            util.debug("Data undefined " + summarydata);
        } else {
            //util.debug("Found it!! " + summarydata);
            resp.send(summarydata);
        }
    });
};

//////
exports.findProductStats = function findProductStats(symbol, resp) {
    util.debug("<<======  SUMMARY  ======>>");
    util.debug("found symbol ..." + symbol);

    var ProductSummary = db.model('ProductSummary', 'productsummary');
    util.debug("Found ProductSummary");

    ProductSummary.find({}, function (err, summarydata) {
        if (err) {
            throw(err);
        } else {
            //util.debug("Good data >> " + summarydata);
        }
        if (!summarydata) {
            util.debug("Data undefined " + summarydata);
        } else {
            //util.debug("Found it!! " + summarydata);
            resp.send(summarydata);
        }
    });
};

//////
exports.findUserStats = function findUserStats(symbol, resp) {
    util.debug("<<======  SUMMARY  ======>>");
    util.debug("found symbol ..." + symbol);

    var UserSummary = db.model('UserSummary', 'usersummary');
    util.debug("Found UserSummary");

    UserSummary.find({}, function (err, summarydata) {
        if (err) {
            throw(err);
        } else {
            //util.debug("Good data >> " + summarydata);
        }
        if (!summarydata) {
            util.debug("Data undefined " + summarydata);
        } else {
            //util.debug("Found it!! " + summarydata);
            resp.send(summarydata);
        }
    });
};

////////////////////////

function preAggregateVendingSummary(data){
    var VendingSummary = db.model('VendingSummary', 'vendingsummary');
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
            summaryDoc.totalSales = data.expense;
            //vending_total_sales = summaryDoc.totalSales;

            summaryDoc.save(function (err) {
                if (err) {
                    throw(err);
                }
            });
        } else {
            doc3[0].vendingmachine = data.vendingmachine;
            doc3[0].totalSales += data.expense;
            doc3[0].save();

            util.debug("Step 4 : Saved the summary.." + JSON.stringify(doc3[0]));
        }
        util.debug("<================ END ===============>");

    }); // End of Summary Calculation
}

function preAggregateProductSummary(data){
    var ProductSummary = db.model('ProductSummary', 'productsummary');
    ProductSummary.find({product: data.product}).limit(1).exec(function (err, doc3) {
        if (!err) {
            util.debug("Found Summary " + doc3[0]);
        } else {
            util.debug("Error: could not find Summary for " + data.product);
        }
        if (!doc3 || doc3.length == 0) {
            util.debug("Event : Create new Summary document ");
            var summaryDoc = new ProductSummary();
            summaryDoc.product = data.product;
            summaryDoc.totalSales = data.expense;
            //vending_total_sales = summaryDoc.totalSales;

            summaryDoc.save(function (err) {
                if (err) {
                    throw(err);
                }
            });
        } else {
            doc3[0].product = data.product;
            doc3[0].totalSales += data.expense;
            doc3[0].save();

            util.debug("Step 4 : Saved the summary.." + JSON.stringify(doc3[0]));
        }
        util.debug("<================ END ===============>");

    }); // End of Summary Calculation
}

///

function preAggregateUserSummary(data){
    var UserSummary = db.model('UserSummary', 'usersummary');
    UserSummary.find({user: data.user}).limit(1).exec(function (err, doc3) {
        if (!err) {
            util.debug("Found Summary " + doc3[0]);
        } else {
            util.debug("Error: could not find Summary for " + data.user);
        }
        if (!doc3 || doc3.length == 0) {
            util.debug("Event : Create new Summary document ");
            var summaryDoc = new UserSummary();
            summaryDoc.user = data.user;
            summaryDoc.totalPayments = data.expense;
            summaryDoc.totalTimeSpent = data.timespent;
            //vending_total_sales = summaryDoc.totalSales;

            summaryDoc.save(function (err) {
                if (err) {
                    throw(err);
                }
            });
        } else {
            doc3[0].user = data.user;
            doc3[0].totalPayments += data.expense;
            doc3[0].totalTimeSpent += data.timespent;
            doc3[0].save();

            util.debug("Step 4 : Saved the summary.." + JSON.stringify(doc3[0]));
        }
        util.debug("<================ END ===============>");

    }); // End of Summary Calculation
}