# Real-time Analytics

## Objective

Real-time Analysis of Event Streams :

['Jan 01, 2016', "V1","Hari","Sunnyvale","Popcorn",1, 100],
['Jan 02, 2016', "V2","Bob","Sunnyvale","ChocoBar",1, 100],
['Jan 03, 2016', "V1","Hari","Santa Clara","Biscuit",.75, 50],
['Jan 04, 2016', "V1","Ram","Sunnyvale","ChocoBar",.5, 90],
['Jan 05, 2016', "V2","Kal","Fremont","Chips",.5, 90],

## Enviroement Setup
### checkout from github
### mongodb setup
    brew install mongodb
    mkdir /data/mongo
    chmod 747 /data/mongo
    service mongodb start  (if installed as service) or  mongod --dbpath=/data/mongo
### redis setup
   brew install mongodb
   redis-server
### setup Node.js app in Webstorm

## Development

### Schema Design
Note : this is just a Demo so Data Models generated just for demonstration purpose.
More detailed discussion available in this document.

var UserPaymentsSchema = new Schema({
    timestamp: {type: Date},
    currentBalance: {type: Number},
    transactionAmount: {type: Number},
    user: {type: String}
}, {safe: safe_params});
mongoose.model('UserPayments', UserPaymentsSchema);

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

### start Nodejs Application
   node main.js

### run services in background
   if you want to run any command in background, then run as - nohup <command> &


## Runtime

#### user accesses the url - http://localhost:3000/

#### node.js first looks into layout.jade and home.jade and loads the static contents

#### next public/media/js/app.js renders the content of home page and listens to WebSocket

#### server opens up a socket.io connection and the streaming module continuously receives the event streams

datasource.js -> simulates external data provider
streaming.js -> simulates data connector that receives the data

#### streaming module publishes messages in redis queue

#### data-access module consumes messages from queue  and stores the raw data into payrangedetails document store

db module also pre aggregates the Vending Machine Stats , User Stats, Product Stats

#### now in the meanwhile as soon as browser starts reciving messages via websocket , it starts displaying the incoming messages.

dojo.addOnLoad ...
>> show the message streams

####  now when a message is selected in browser ...

>> Http Get request  /vendingmachinesummary/{name}

>> app.get("/vendingmachinesummary/:name", function(req, resp) {
>> - get the symbol from the Reqest
>> - Query the database to get the Summary data (totalSales for this vending machine) and also fetch the Historical Timeseriese data 
>> - send the data to Frontend 

#### Screenshots of the Runtime Flow - specified in the 'Design Document'

## Analytics Queries :

As streaming data arrives , aggregation values for various metrics keep changing in the stats tables.

Lets assume the corresponing the charts will be refreshed and show latest data 

#### the best-selling products

db.productsummary.find({},{product:1,totalSales:1,_id:0}).sort({"totalSales":-1})

> db.productsummary.find({},{product:1,totalSales:1}).sort({"totalSales":-1})
{ "totalSales" : 10.25, "product" : "Popcorn" }
{"totalSales" : 6.75, "product" : "ChocoBar" }
{"totalSales" : 6.25, "product" : "Chips" }
{"totalSales" : 6, "product" : "Biscuit" }
{"totalSales" : 3, "product" : "Dry Fruits" }

after some time when we fire the same query 

> db.productsummary.find({},{product:1,totalSales:1,_id:0}).sort({"totalSales":-1})
{ "totalSales" : 11.25, "product" : "Popcorn" }
{ "totalSales" : 7.75, "product" : "ChocoBar" }
{ "totalSales" : 6.25, "product" : "Chips" }
{ "totalSales" : 6, "product" : "Biscuit" }
{ "totalSales" : 3.5, "product" : "Dry Fruits" }



#### users spending highest amount of money

> db.usersummary.find({},{user:1,totalPayments:2,_id:0}).sort({"totalPayments":-1})
{ "totalPayments" : 14.5, "user" : "Hari" }
{ "totalPayments" : 3.5, "user" : "Sam" }
{ "totalPayments" : 3, "user" : "Patrick" }
{ "totalPayments" : 2.75, "user" : "Rabi" }
{ "totalPayments" : 2.5, "user" : "Kal" }
{ "totalPayments" : 2, "user" : "Teri" }
{ "totalPayments" : 1.5, "user" : "Ram" }
{ "totalPayments" : 1.5, "user" : "Justin" }
{ "totalPayments" : 1.25, "user" : "Ben" }
{ "totalPayments" : 1, "user" : "Bob" }
{ "totalPayments" : 1, "user" : "Tom" }
{ "totalPayments" : 1, "user" : "Poli" }
{ "totalPayments" : 1, "user" : "Pamela" }
{ "totalPayments" : 0.5, "user" : "Jon" }
{ "totalPayments" : 0.5, "user" : "Doli" }

#### users spending time with vending machine

> db.usersummary.find({},{user:1,totalTimeSpent:2,_id:0}).sort({"totalTimeSpent":-1})
{ "totalTimeSpent" : 1410, "user" : "Hari" }
{ "totalTimeSpent" : 390, "user" : "Rabi" }
{ "totalTimeSpent" : 300, "user" : "Ben" }
{ "totalTimeSpent" : 250, "user" : "Sam" }
{ "totalTimeSpent" : 200, "user" : "Tom" }
{ "totalTimeSpent" : 190, "user" : "Kal" }
{ "totalTimeSpent" : 180, "user" : "Teri" }
{ "totalTimeSpent" : 170, "user" : "Ram" }
{ "totalTimeSpent" : 170, "user" : "Patrick" }
{ "totalTimeSpent" : 100, "user" : "Bob" }
{ "totalTimeSpent" : 100, "user" : "Don" }
{ "totalTimeSpent" : 90, "user" : "Pamela" }
{ "totalTimeSpent" : 80, "user" : "Poli" }
{ "totalTimeSpent" : 70, "user" : "Doli" }
{ "totalTimeSpent" : 60, "user" : "Urmi" }
{ "totalTimeSpent" : 50, "user" : "Jon" }

#### best-performing vending machines
> db.vendingsummary.find({},{vendingmachine:1,totalSales:2,_id:0}).sort({"totalSales":-1})
{ "totalSales" : 18.25, "vendingmachine" : "V1" }
{ "totalSales" : 4.5, "vendingmachine" : "V7" }
{ "totalSales" : 4.5, "vendingmachine" : "V3" }
{ "totalSales" : 4, "vendingmachine" : "V2" }
{ "totalSales" : 2.5, "vendingmachine" : "V6" }
{ "totalSales" : 2.5, "vendingmachine" : "V5" }
{ "totalSales" : 1.5, "vendingmachine" : "V9" }
{ "totalSales" : 1.5, "vendingmachine" : "V10" }
