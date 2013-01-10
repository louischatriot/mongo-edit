/**
 * All routes are aggregated here
 *
 */

module.exports = {
  index: require('./index')
, collection: require('./collection')
, docEdit: require('./docEdit')
, docDelete: require('./docDelete')
, docChange: require('./docChange')
, createDoc: require('./createDoc')
};
