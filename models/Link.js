const { Schema, model, Types } = require("mongoose");

const shema = new Schema({
  from: { type: String, require: true },
  to: { type: String, require: true, unique: true },
  code: { type: String, require: true, unique: true },
  date: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
  owner: { type: Types.ObjectId, ref: "User" }
});

module.exports = model("Link", shema);
