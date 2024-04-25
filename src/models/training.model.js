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
  facultyMail: { // New field for faculty email
    type: String,
    required: true,
  },
  meetingDescription: { // New field for meeting description
    type: String,
    required: true,
  },
  plantName: {
    type: String,
    required: true,
  },
  plantId: {
    type: String,
    required: true,
  },
  
  empCodes: {
    type: Array,
    required: true,
  },
  acknowledgement:{
    type:Boolean,
    default:false
  },
  completed:{
    type : Boolean ,
    default:false
  }
});

const TrainingModel = mongoose.model('Training', trainingSchema);

module.exports = TrainingModel;
