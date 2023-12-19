const mongoose = require('mongoose');
const { Schema } = mongoose;

const trainingSchema = new Schema({
  
  projectName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  fromTime: {
    type: String,
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
  plantCode: {
    type: String,
    required: true,
  }
});

const TrainingModel = mongoose.model('Training', trainingSchema);

module.exports = TrainingModel;
