const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const URLSchema = new Schema(
  {
    urlOwnerID: {
      type: String,
      required: true,
    },
    urlTarget: {
      type: String,
      required: true,
    },
    urlOld: {
      type: String,
      required: true,
    },
    urlNew: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const URLModel = mongoose.model("url", URLSchema);

module.exports = URLModel;
