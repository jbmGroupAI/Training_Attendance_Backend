


const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for timeInfo objects
const timeInfoSchema = new Schema({
  time: {
    type: Date,
    required: true,
  },
});

// Define the main training session schema
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
  },
  meetingDescription: {
    type: String,
    required: true,
  },
  plantNames: {
    type: Array,
    required: true,
  },
  plantIds: {
    type: Array,
    required: true,
  },
  empCodes: {
    type: Array,
    required: true,
  },
  meetingId: {
    type: String,
    required: true,
  },
  allEmployees: {
    type: [{
      empOnlyId: {
        type: Number,
        required: true,
      },
      empFName: {
        type: Array,
        required: true,
      },
      planned: {
        type: Boolean,
        required: true,
      },
      department: {
        type: [String], // Assuming department is an array of strings
        required: true,
      },
      timeInfo: {
        type: [timeInfoSchema], // Array of timeInfo objects
        required: true,
      },
      
      empPlantId: {
        type: Array,
        required: true,
      },
      acknowledgement: {
        type: Boolean,
        default: true,
      },
    }],
    required: true,
  },
  acknowledgement: {
    type: Boolean,
    default: false,
  },
  endTraining: {
    type: String,
    required: true,
  },
  
});

const TrainingModel = mongoose.model('FinalData', trainingSchema);

module.exports = TrainingModel;
