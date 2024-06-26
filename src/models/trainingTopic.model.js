const mongoose = require('mongoose');
const { Schema } = mongoose;

const topicSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Topic', topicSchema);
