/**
 * All routes are aggregated here
 *
 */

module.exports = {
  index: require('./index')
, collection: require('./collection')
, collectionCreate: require('./collectionCreate')
, collectionDelete: require('./collectionDelete')
, docEdit: require('./docEdit')
, doc: require('./doc')
, docDelete: require('./docDelete')
, docChange: require('./docChange')
, docCreate: require('./docCreate')
};
