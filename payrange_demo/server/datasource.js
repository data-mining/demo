/**
 * New node file
 */



////////////////////////////////

/**
 * log -> date, vendor name, user name, location, product name, price, time spent
 * @type {*[]}
 */
var PAY_RANGE_EVENT_RECORDS = [
	['Jan 01, 2016', "V1","Hari","Sunnyvale","Popcorn",1, 100],
	['Jan 02, 2016', "V2","Bob","Sunnyvale","ChocoBar",1, 100],
	['Jan 03, 2016', "V1","Hari","Santa Clara","Biscuit",.75, 50],
	['Jan 04, 2016', "V1","Ram","Sunnyvale","ChocoBar",.5, 90],
	['Jan 05, 2016', "V2","Kal","Fremont","Chips",.5, 90],
	['Jan 06, 2016', "V2","Sam","Sunnyvale","Popcorn",.5, 100],
	['Jan 07, 2016', "V1","Patrick","Sunnyvale","Chips",2, 100],
	['Jan 08, 2016', "V1","Kal","Fremont","Biscuit",1.5, 50],
	['Jan 09, 2016', "V3","Hari","Santa Clara","Biscuit",1, 50],
	['Jan 10, 2016', "V3","Hari","Sunnyvale","Popcorn",.5, 50],
	['Jan 11, 2016', "V3","Jon","SFO","Popcorn",.5, 50],
	['Jan 12, 2016', "V1","Ben","Portland","ChocoBar",.5, 100],
	['Jan 13, 2016', "V1","Tom","Sunnyvale","Popcorn",.5, 100],
	['Jan 14, 2016', "V5","Ben","Santa Clara","ChocoBar",.75, 200],
	['Jan 14, 2016', "V5","Hari","Sunnyvale","Popcorn",.75, 60],
	['Jan 14, 2016', "V5","Patrick","Sunnyvale","ChocoBar",1, 70],
	['Jan 14, 2016', "V1","Hari","Sunnyvale","ChocoBar",1.5, 120],
	['Jan 14, 2016', "V1","Sam","Fremont","Dry Fruits",2, 60],
	['Jan 15, 2016', "V7","Hari","SFO","Popcorn",2, 60],
	['Jan 16, 2016', "V7","Teri","Portland","Chips",1, 80],
	['Jan 17, 2016', "V7","Rabi","Mountain View","Chips",1, 90],
	['Jan 18, 2016', "V1","Hari","Sunnyvale","Biscuit",1, 100],
	['Jan 19, 2016', "V1","Kal","Mountain View","Popcorn",0.5, 50],
	['Jan 20, 2016', "V9","Hari","Sunnyvale","Chips",0.75, 100],
	['Jan 21, 2016', "V9","Rabi","Mountain View","Popcorn",.75, 200],
	['Jan 21, 2016', "V1","Hari","San Jose","Popcorn",.75, 250],
	['Jan 21, 2016', "V10","Hari","Sunnyvale","Chips",1, 100],
	['Jan 22, 2016', "V1","Poli","Portland","Popcorn",1, 80],
	['Jan 23, 2016', "V1","Urmi","San Jose","Biscuit",.25, 60],
	['Jan 24, 2016', "V10","Doli","Sunnyvale","ChocoBar",.5, 70],
	['Jan 25, 2016', "V1","Pamela","Sunnyvale","ChocoBar",1, 90],
	['Jan 25, 2016', "V1","Hari","San Jose","Popcorn",1, 120],
	['Jan 25, 2016', "V7","Tom","Portland","Popcorn",0.5, 100],
	['Jan 26, 2016', "V6","Hari","Sunnyvale","Biscuit",0.5, 110],
	['Jan 26, 2016', "V6","Ram","Fremont","Biscuit",1, 80],
	['Jan 27, 2016', "V6","Sam","San Jose","Dry Fruits",1, 90],
	['Jan 27, 2016', "V1","Teri","Sunnyvale","Popcorn",1, 100],
	['Jan 26, 2016', "V1","Hari","Los Gatos","Dry Fruits",0.5, 100],
	['Jan 25, 2016', "V3","Rabi","San Mateo","ChocoBar",1, 100],
	['Jan 25, 2016', "V3","Hari","Sunnyvale","Kitkat",1.5, 40],
	['Jan 29, 2016', "V2","Justin","Sunnyvale","Popcorn",1.5, 50],
	['Jan 29, 2016', "V2","Don","San Jose","Dry Fruits",0.5, 100],
	['Jan 30, 2016', "V2","Jon","San Jose","ChocoBar",0.5, 80]
             	  ];
exports.getSampleData = function getSampleData() {
	 return PAY_RANGE_EVENT_RECORDS;
};

exports.getTimeStamp = function getTimeStamp(index) {
             	if(typeof PAY_RANGE_EVENT_RECORDS[index] == 'undefined') {
             		return undefined;
             	}
             	
             	return new Date(PAY_RANGE_EVENT_RECORDS[index][0]);
             };

exports.getVendingMachine = function getVendingMachine(index) {
	if(typeof PAY_RANGE_EVENT_RECORDS[index] == 'undefined') {
		return undefined;
	}
	return PAY_RANGE_EVENT_RECORDS[index][1];
};
exports.getUser = function getUser(index) {
	if(typeof PAY_RANGE_EVENT_RECORDS[index] == 'undefined') {
		return undefined;
	}
	return PAY_RANGE_EVENT_RECORDS[index][2];
};
exports.getCity = function getCity(index) {
	if(typeof PAY_RANGE_EVENT_RECORDS[index] == 'undefined') {
		return undefined;
	}
	return PAY_RANGE_EVENT_RECORDS[index][3];
};
exports.getProduct = function getProduct(index) {
	if(typeof PAY_RANGE_EVENT_RECORDS[index] == 'undefined') {
		return undefined;
	}
	return PAY_RANGE_EVENT_RECORDS[index][4];
};

 exports.getExpense = function getExpense(index) {
             	if(typeof PAY_RANGE_EVENT_RECORDS[index] == 'undefined') {
             		return undefined;
             	}
             	return PAY_RANGE_EVENT_RECORDS[index][5];
             };

 exports.getTimeSpent = function getTimeSpent(index) {
             	if(typeof PAY_RANGE_EVENT_RECORDS[index] == 'undefined') {
             		return undefined;
             	}
             	return PAY_RANGE_EVENT_RECORDS[index][6];
             };

