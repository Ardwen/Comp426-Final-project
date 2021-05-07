const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const invitationSchema = new Schema(
  {
    courseID: { type: String,required: true},
    sentByID: { type: String,required: true},
    sendToID: { type: String,required: true},
    courseName: { type: String,required: true},
    date: { type: Date, required: true },
    time: { type: Array, required: true }
  },
  {
    timestamps: true
  }
);

const Invitation = mongoose.model("Invitation", invitationSchema);

module.exports = Invitation;
