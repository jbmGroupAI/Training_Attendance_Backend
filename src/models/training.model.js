const mongoose = require('mongoose');
const { Schema } = mongoose;

const trainingSchema = new Schema({
  fromTime: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  selectedDate: {
    type: Date,
    required: true,
  },
  toTime: {
    type: String,
    required: true,
  },
  trainerName: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
});

const TrainingModel = mongoose.model('Training', trainingSchema);

module.exports = TrainingModel;
