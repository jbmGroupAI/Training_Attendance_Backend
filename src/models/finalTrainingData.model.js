
// const mongoose = require('mongoose');
// const { Schema } = mongoose;


// const trainingSchema = new Schema({
//   projectName: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   fromTime: {
//     type: String,
//     required: true,
//   },
//   toTime: {
//     type: String,
//     required: true,
//   },
//   trainerName: {
//     type: String,
//     required: true,
//   },
//   facultyMail: { // New field for faculty email
//     type: String,
//     required: true,
//   },
//   meetingDescription: { // New field for meeting description
//     type: String,
//     required: true,
//   },
//   plantName: {
//     type: String,
//     required: true,
//   },
//   plantId: {
//     type: String,
//     required: true,
//   },
//   empCodes: {
//     type: Array,
//     required: true,
//   },
//   allEmployees:{
//     type: [{
//       empOnlyId: {
//         type: Number,
//         required: true,
//       },
//       empFName: {
//         type: Array,
//         required: true,
//       },
//       planned: {
//         type: Boolean,
//         required: true,
//       },
//       department: {
//         type: Array,
//         required: true,
//       },
//       timeInfo: {
//         type: Array,
//         required: true,
//       },
//       empPlantId: {
//         type: Array,
//         required: true,
//       }
//     }],
//     required: true
//   }
// });

// const TrainingModel = mongoose.model('FinalData', trainingSchema);

// module.exports = TrainingModel;

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for timeInfo objects
const timeInfoSchema = new Schema({
  // _id: {
  //   type: String, // Assuming _id is a string
  //   required: true,
  // },
  time: {
    type: Date,
    required: true,
  },
  // camId: {
  //   type: String,
  //   required: true,
  // },
  // location: String, // Assuming location is optional
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
  meetingId: {
    type: String,
    required: true
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
        default: true
      }
    }],
    required: true
  },
  acknowledgement:{
    type:Boolean,
    default:false
  }
});

const TrainingModel = mongoose.model('FinalData', trainingSchema);

module.exports = TrainingModel;
