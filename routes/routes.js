/**
 * All routes are aggregated here
 *
 */

module.exports = {
  index: require('./index')
, collection: require('./collection')
, collectionCreate: require('./collectionCreate')
, docEdit: require('./docEdit')
, docDelete: require('./docDelete')
, docChange: require('./docChange')
, docCreate: require('./docCreate')
};
