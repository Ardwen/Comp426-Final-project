const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseName: { type: String, required: true },
    time: { type: Array, required: true },
    date: { type: Date, required: true },
    participants: { type: Array, required: false }
  },
  {
    timestamps: true
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
