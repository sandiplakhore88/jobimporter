const xml2js = require('xml2js');

const parseXML = async (xml) => {
  try {
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xml);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { parseXML };
