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
  , DBRef = mongodb.DBRef
  , spacer = '  '
  , stringDelimiter = '"'
  ;


/**
 * Get the actual spacer string from an offset
 *
 */
function offsetSpaces (offset) {
  var res = '' , i;
  for (i = 0; i < offset; i += 1) { res += spacer; }
  return res;
}


/**
 * Serialize a value that could be found in an object pulled from the database in a string
 * that can correctly be displayed in the GUI's ACE editor
 *
 */
function serializeItem(item, _offset) {
  var offset = _offset || 0
    , res
    , escapedCharactersReplacement = { '\n': '\\n'
                                     , '\r': '\\r'
                                     , '\f': '\\f'
                                     , '\b': '\\b'
                                     , '\t': '\\t'
                                     , '\v': '\\v'
                                     }
    ;

  if (item === undefined) {
    return "undefined";
  }

  if (typeof item === 'string') {
    res = item.replace(new RegExp(stringDelimiter, "g"), '\\' + stringDelimiter);   // Escape string delimiter

    // Make escaped characters visible in the string so that eval understands it
    Object.keys(escapedCharactersReplacement).forEach(function (key) {
      res = res.replace(new RegExp(key, "g"), escapedCharactersReplacement[key]);
    });

    return stringDelimiter + res + stringDelimiter;
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


/**
 * Return a serializable version of the key (i.e. if it cannot represent a variable, put quotes around it)
 *
 */
function serializeObjectKey(key) {
  if (key.match(/^[a-zA-Z][a-zA-Z0-9]*$/)) {
    return key;
  } else {
    return stringDelimiter + key + stringDelimiter;
  }
}


/**
 * Serialize an object pulled from the database for display in the GUI's ACE editor
 * @param {Object} object
 * @param {Number} _offset how much space to add on the left of each line
 * @return {String}
 *
 */
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
      res = res + prefix + comma + serializeObjectKey(key) + ": " + serializeItem(object[key], offset + 1) + '\n';
    }
    res = res + prefix + '}';
  }

  return res;
}


/**
 * Transform the serialized data from the GUI and turn it into the corresponding persistable object
 * @param {String} data
 * @return {Object}
 */
function deserializeFromGUI (data) {
  var res
    ;

  data = data.replace(/^.+=[^{]+/, '');   // Remove the 'doc = ' (even if the user changed the name of the variable)

  // Yes, eval is evil. Except that here we're in a trusted environment
  // and it enables us to use a much better syntax for the GUI
  // This is one of the correct usecases for eval as described by Eric Lippert
  // in the beginning of http://blogs.msdn.com/b/ericlippert/archive/2003/11/01/53329.aspx
  eval("res = " + data);

  return res;
}


module.exports.serializeForGUI = serializeForGUI;
module.exports.deserializeFromGUI = deserializeFromGUI;

