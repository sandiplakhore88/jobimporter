
const sanitizeKeys =(obj) =>{
  if (Array.isArray(obj)) {
    return obj.map(sanitizeKeys);
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      const safeKey = key.startsWith('$') ? key.replace('$', '_') : key;
      newObj[safeKey] = sanitizeKeys(obj[key]);
    }
    return newObj;
  }
  return obj;
}

module.exports = { sanitizeKeys };
