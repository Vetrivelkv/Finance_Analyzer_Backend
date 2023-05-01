const { User } = require("../../models/user");
const { Migration } = require("../../models/migration");

module.exports.applyScript = async function () {
  try {
    await Migration.createCollection().then(function (collection) {
      console.log("Migration Collection is created!");
    });
    let mig = new Migration({
      scriptName: "initial-create",
      sequence: 1,
    });
    await mig.save();
    await User.createCollection();
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
