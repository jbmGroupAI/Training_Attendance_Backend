const mongoose = require('mongoose');
const { Schema } = mongoose;

const empCodeSchema = new Schema({
  empOnlyId: {
    type: String,
    required: true,
  },
  empFName: {
    type: String,
    required: true,
  },
  plantIds: {
    type: String,
    // required: true,
  }
  
});

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
  facultyMail: { 
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  meetingDescription: { 
    type: String,
    required: true,
  },
  plantNames: {
    type: [String],
    required: true,
  },
  plantIds: {
    type: [String],
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  venueId: {
    type: String,
    required: true,
  },
  empCodes: {
    type: [empCodeSchema],
    required: true,
  },
  acknowledgement: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  participantEmails: {
    type: [String],
    // required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 50'],
    match: /.+\@.+\..+/,
  },
  trainingLink:{
    type: String,

  },
 
});

function arrayLimit(val) {
  return val.length <= 50;
}

const TrainingModel = mongoose.model('Training', trainingSchema);

module.exports = TrainingModel;
