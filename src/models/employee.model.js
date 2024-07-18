const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const employeeSchema = mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      index: true,
    },
   employeeName:{
    type: String,
    required: true
   },
   plantIds:{
    type: Number,
    required: true
   },
  trainingId:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'Training'
  },
  finalTrainingId:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'FinalData'
  }
  },
  {
    timestamps: true,
  }
);

employeeSchema.plugin(toJSON);


const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
