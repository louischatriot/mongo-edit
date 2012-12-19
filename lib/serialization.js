/**
 * Library used to serialize/deserialize objects
 * in a way that keeps the types (ObjectIds, Dates etc) unchanged
 * and that's not a pain to edit in the GUI
 *
 * Note that we consider that we are in a trusted environment so we
 * can use eval here. This enables us to use a more concise syntax
 *
 */

var mongodb = require('mongodb')
  , ObjectID = mongodb.ObjectID
  , spacer = '  '
	;


function offsetSpaces (offset) {
  var res = '' , i;
  for (i = 0; i < offset; i += 1) { res += spacer; }
  return res;
}


function serializeItem(item, _offset) {
  var offset = _offset || 0;

  if (typeof item === 'string') {
    return item;
  }

  if (typeof item === 'number') {
    return item;
  }

  if (typeof item === 'boolean') {
    return item;
  }

  // Base case is Array or Object (we couldn't match any of the MongoDB-primitive types)
  return serializeForDBGUI(item, offset);
}


function serializeForDBGUI (object, _offset) {
  var keys, i, key, comma
    , offset = _offset || 0
    , prefix = offsetSpaces(offset)
    , res
    ;

  if (!object) { return ""; }

  if (object instanceof Array) {
    res = "[\n";
    for (i = 0; i < object.length; i += 1) {
      comma = i > 0 ? ', ' : '  ';
      res = res + prefix + comma + serializeItem(object[i], offset + 1) + '\n';
    }
    res = res + prefix + ']';
  } else {
    res = "{\n";
    keys = Object.keys(object);
    for (i = 0; i < keys.length; i += 1) {
      key = keys[i];
      comma = i > 0 ? ', ' : '  ';
      res = res + prefix + comma + key + ": " + serializeItem(object[key], offset + 1) + '\n';
    }
    res = res + prefix + '}';
  }

  return res;
};


module.exports.fromJson = function (json) {
	return JSON.parse(json);
};



module.exports.serializeForDBGUI = serializeForDBGUI;
