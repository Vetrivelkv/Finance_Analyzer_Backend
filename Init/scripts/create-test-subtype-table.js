const { TestSubType } = require("../../models/testSubType");

module.exports.applyScript = async function () {
  try {
    await TestSubType.createCollection();

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
