const { model } = require("mongoose");

module.exports = model("user", {
  _id: String,
  coins: { type: Number, default: 0 },
});
