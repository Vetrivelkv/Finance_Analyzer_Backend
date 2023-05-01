const { QA } = require("../../models/qa");

module.exports.applyScript = async function () {
  try {
    await QA.createCollection();
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      err,
    };
  }
};
