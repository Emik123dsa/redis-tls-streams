function isEmpty(object) {
  return Object.keys(object).length !== 0 && object.constructor === Object;
}

function unique(value) {
  return value != null && Array.isArray(value) ? [...new Set(value)] : [];
}

function isFunction(value) {
  return typeof value === 'function';
}

module.exports = { unique, isEmpty, isFunction };
