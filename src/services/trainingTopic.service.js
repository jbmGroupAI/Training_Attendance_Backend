const Topic = require('../models/trainingTopic.model');

class TopicService {
    async getAllTopics() {
      return await Topic.find();
    }
  
    async createTopic(topicData) {
      const topic = new Topic(topicData);
      return await topic.save();
    }
  }
  
  module.exports = new TopicService();
