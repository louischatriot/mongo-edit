/**
 * Library used to convert BSON documents to and from JSON equivalent
 * in a way that keeps the types (ObjectIds, Dates etc) unchanged
 *
 */

var mongodb = require('mongodb')
  , ObjectID = mongodb.ObjectID
	;


module.exports.toJson = function (object) {
	console.log(object._id.constructor.name);

	Date.toJSON = function () {
		return "a";
	}


	return JSON.stringify(object, function (key, value) {
		//if (typeof value === 'object') {
			//return value;
		//}

		//console.log('---');
		//console.log(key);
		//console.log(value);
		//console.log(value.constructor.name);

		return value;
	}, 2);
};


module.exports.fromJson = function (json) {
	return JSON.parse(json);
};
