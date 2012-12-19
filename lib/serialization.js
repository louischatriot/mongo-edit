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
  , stringDelimiter = '"'
	;


function offsetSpaces (offset) {
  var res = '' , i;
  for (i = 0; i < offset; i += 1) { res += spacer; }
  return res;
}


function serializeItem(item, _offset) {
  var offset = _offset || 0;

  if (typeof item === 'string') {
    return stringDelimiter + item.replace(stringDelimiter, '\\' + stringDelimiter) + stringDelimiter;
  }

  if (typeof item === 'number') {
    return item;
  }

  if (typeof item === 'boolean') {
    return item.toString();
  }

  if (item.constructor.name === 'Date') {
    return 'new Date("' + item.toString() + '")';
  }

  if (item.constructor.name === 'ObjectID') {
    return 'new ObjectID("' + item.toString() + '")';
  }

  // Base case is Array or Object (we couldn't match any of the MongoDB-primitive types)
  return serializeForGUI(item, offset);
}


function serializeForGUI (object, _offset) {
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


function deserializeFromGUI (data) {
  var res;

  // Yes, eval is evil. Except that here we're in a trusted environment
  // and it enables us to use a much better syntax for the GUI
  // This is one of the correct usecases for eval as described by Eric Lippert
  // in the beginning of http://blogs.msdn.com/b/ericlippert/archive/2003/11/01/53329.aspx
  eval("res = " + data);

  return res;
};


module.exports.serializeForGUI = serializeForGUI;
module.exports.deserializeFromGUI = deserializeFromGUI;

