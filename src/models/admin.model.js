const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
  // trainingTopic: {
  //   type: String,
  //   required: true,
  // },
  venue: {
    type: String,
    required: true,
  },
  venueId: {
    type: String,
    required: true,
    unique: true
  },
  legalCode: {
    type: String,
    required: true,
    unique: true,
  },
 
});



const AdminModel = mongoose.model('Admin', adminSchema);

module.exports = AdminModel;
