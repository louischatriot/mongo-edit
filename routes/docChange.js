/**
 * Modify the contents of a document
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , serialization = require('../lib/serialization')
  , helpers = require('../lib/helpers')
  ;

module.exports = function (req, res, next) {
  var newDoc, collection;

  if (!req.params.collection || !req.params.id) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  try {
    newDoc = serialization.deserializeFromGUI(req.body.newData);
  } catch(e) {
    return res.json(403, { message: 'Badly formatted data', error: e });
  }

  helpers.getIdFromStringId(req.params.collection, req.params.id, function (err, id) {
    if (err) { return res.send(400, err); }

    // Check that the id was not changed
    if (!helpers.areIdsEqual(id, newDoc._id)) { return res.json(403, { message: '_id can\'t be modified' }); }
    delete newDoc._id;   // Mongo won't be able to update the doc if it thinks we want to change it's _id

    collection = db.collection(req.params.collection);
    collection.update({ _id: id }, newDoc, { safe: true }, function (err) {
      if (err) { return res.json(403, err); }

      return res.redirect(config.baseUrl + '/' + req.params.collection + '/' + req.params.id + '/edit?type=alert-success&message=The document was successfully edited');
    });
  });
};
