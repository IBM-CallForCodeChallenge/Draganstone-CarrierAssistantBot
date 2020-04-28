var Cloudant = require('@cloudant/cloudant');
var cloudant = new Cloudant({ url: 'https://4390dc44-0e8c-4eca-8365-76e6254718a6-bluemix.cloudant.com', plugins: { iamauth: { iamApiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' } } });
var dbname = 'dragonstone_cfc2020db_carrier_retailer';
var db = cloudant.db.use(dbname);
var doc;

var createDocument = function(param, callback) {
  console.log("Creating document on cloudant");
  // we are specifying the id of the document so we can update and delete it later
    db.insert(param, function(err, data) {
    callback(err, data);
  });
};

var findDocument = function(param, callback) {
  console.log("Reading document");
  db.get({selector:{$or:[{location:param.location},{location:param.pickup}]},fields:['name','contact']}, function(err, data) {
    // keep a copy of the doc so you know its revision token
    var doc = data;
    callback(err, data);
  });
};


/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {
    if(params.user == "carrier" && params.authorization == "Yes"){
        createDocument(params);
        return {boolean : 'true'};
    }else if(params.user == "carrier" && params.authorization == "No"){
        return {boolean : 'false'};
    }else{
        findDocument(params);
        return { message: doc };
    }
}