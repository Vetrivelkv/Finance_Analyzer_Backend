const mongoose = require("mongoose");

const migrationSchema = mongoose.Schema({
  scriptName: {
    type: String,
    required: true,
  },
  sequence: {
    type: Number,
    required: true,
  },
});

exports.Migration = mongoose.model("Migration", migrationSchema);
