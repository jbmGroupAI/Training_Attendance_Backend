const mongoose = require('mongoose');
const { Schema } = mongoose;

const topicSchema = new Schema({
  trainingTopic: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model('Topic', topicSchema);
