const mongoose = require(`mongoose`);
const AutoIncrement = require("mongoose-sequence")(mongoose);

const user = mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    subscription: { type: Boolean, default: false },
    country: { type: String },
    mobile: { type: String },
    businessName: { type: String },
    type: { type: String },
    gstNumber: { type: String },
    referalCode: { type: String },
    isActive: { type: Number, default: 1 },
    isVerified: { type: Boolean, default: true },
    emailIdentifier:{type:String}
    
    // 1=> active ,2=>disable,3=> deleted
  },
  { timestamps: true }
);

user.index({ name: 1, email: 1, mobile: 1 }, { background: true });
user.plugin(AutoIncrement, {
  inc_field: "customerId",
  start_seq: 1000,
  prefix: "FIN-",
});

var userModel = mongoose.model("user", user);

module.exports = {
  userModel,
};
