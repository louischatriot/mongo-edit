var ObjectID = require('mongodb').ObjectID;

module.exports.idForRequestId = function (request_id) {
  return (request_id.length == 12 || request_id.match(/^[0-9a-f]{24}$/)) ?
                                        ObjectID(request_id) : request_id;

};
