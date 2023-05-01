const _scripts = require("./dbScripts");
const { Migration } = require("../models/migration");

const _runScripts = async function () {
  let run = 0;
  for (var i = 0; i <= run; i++) {
    const checkLast = await Migration.find().sort({ sequence: -1 }).limit(1);
    let executeScript = false;
    if (checkLast.length > 0) {
      if (checkLast[0].sequence <= _scripts.length) {
        for (const script of _scripts) {
          if (checkLast[0].scriptName == script.key) {
            executeScript = true;
            continue;
          }
          if (executeScript) {
            await script.export.applyScript();
            let mig = new Migration({
              scriptName: script.key,
              sequence: checkLast[0].sequence + 1,
            });
            await mig.save();
          }
        }
      }
    } else {
      await _scripts[0].export.applyScript();
      run = 1;
    }
  }
};

module.exports.run = _runScripts;
