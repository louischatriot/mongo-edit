/**
 * Library used to convert BSON documents to and from JSON equivalent
 * in a way that keeps the types (ObjectIds, Dates etc) unchanged
 *
 */

module.exports.toJson = function (object) {
	return JSON.stringify(object, function (key, value) {
		//if (typeof value === 'object') {
			//return value;
		//}

		console.log('---');
		console.log(key);
		console.log(value);
		console.log(value.constructor.name);

		return value;
	}, 2);
};


module.exports.fromJson = function (json) {
	return JSON.parse(json);
};
