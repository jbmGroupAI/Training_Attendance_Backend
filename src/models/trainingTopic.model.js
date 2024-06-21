const mongoose = require('mongoose');

const trainingTopicSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('TrainingTopic', trainingTopicSchema);