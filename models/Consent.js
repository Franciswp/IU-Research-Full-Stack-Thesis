const mongoose = require("mongoose");

const ConsentSchema = new mongoose.Schema({
  consent1: { type: Boolean, required: true },
  consent2: { type: Boolean, required: true },
  consent3: { type: Boolean, required: true },
  consent4: { type: Boolean, required: true },
  consent5: { type: Boolean, required: true },
  consent6: { type: Boolean, required: true },

  participantName: { type: String, required: true, trim: true },
  signature: { type: String, required: true, trim: true }, // electronic signature (name)
  date: { type: Date, required: true },

  ipAddress: { type: String }, // optional: for auditing (be mindful of privacy)
  userAgent: { type: String }, // optional
}, {
  timestamps: true
});

module.exports = mongoose.model("Consent", ConsentSchema);