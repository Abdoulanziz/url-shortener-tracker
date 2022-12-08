const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    urlID: {
      type: String,
      required: true,
    },
    urlTarget: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    continent: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const locationModel = mongoose.model("location", locationSchema);

module.exports = locationModel;
