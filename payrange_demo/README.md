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

#### as user accesses the url - http://localhost:3000/

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
>> - Query the database to get the Summary data
>> - send the data in JSON ()




