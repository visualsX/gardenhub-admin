export function capitalizeFirstLetter(str) {
  if (!str) return str; // Return as-is if the string is empty
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  return Object.keys(obj).reduce((acc, key) => {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    acc[capitalizedKey] = obj[key];
    return acc;
  }, {});
}

export function getLastIdx(arr) {
  return arr[arr.length - 1];
}
//console.log(getLast([1,2,3])); // 3
