/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const omitSet = new Set(fields);
  return Object.keys(obj).reduce((acc, cur) => {
    if (!omitSet.has(cur)) {
      acc[cur] = obj[cur];
    }
    return acc;
  }, {});
};
