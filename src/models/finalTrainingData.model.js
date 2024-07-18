// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const timeInfoSchema = new Schema({
//   time: {
//     type: Date,
//     required: true,
//   },
// });

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
//   facultyMail: {
//     type: String,
//     required: true,
//   },
//   meetingDescription: {
//     type: String,
//     required: true,
//   },
//   plantNames: {
//     type: Array,
//     required: true,
//   },
//   plantIds: {
//     type: Array,
//     required: true,
//   },
//   venue: {
//     type: String,
//     required: true,
//   },
//   venueId: {
//     type: String,
//     required: true,
//   },
//   empCodes: {
//     type: Array,
//     required: true,
//   },
//   meetingId: {
//     type: String,
//     required: true,
//   },
//   allEmployees: {
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
//         type: [String], 
//         required: true,
//       },
//       timeInfo: {
//         type: [timeInfoSchema], 
//         required: true,
//       },
      
//       empPlantId: {
//         type: Array,
//         required: true,
//       },
//       acknowledgement: {
//         type: Boolean,
//         default: true,
//       },
//     }],
//     required: true,
//   },
//   acknowledgement: {
//     type: Boolean,
//     default: false,
//   },
//   endTraining: {
//     type: String,
//     required: true,
//   },
  
// });

// const TrainingModel = mongoose.model('FinalData', trainingSchema);

// module.exports = TrainingModel;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeInfoSchema = new Schema({
  time: {
    type: Date,
    required: true,
  },
});

const employeeSchema = new Schema({
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
    type: [String], 
    required: true,
  },
  timeInfo: {
    type: [timeInfoSchema], 
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
});

// Add a virtual field for the acknowledgement status
employeeSchema.virtual('acknowledgementStatus').get(function() {
  const isAbsent = this.timeInfo.length === 0;
  this.acknowledgement = isAbsent ? false : this.acknowledgement;
  return isAbsent ? 'Absent' : this.acknowledgement;
});

employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

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
  venue: {
    type: String,
    required: true,
  },
  venueId: {
    type: String,
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
    type: [employeeSchema],
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

trainingSchema.set('toJSON', { virtuals: true });
trainingSchema.set('toObject', { virtuals: true });

const TrainingModel = mongoose.model('FinalData', trainingSchema);

module.exports = TrainingModel;

