// const Topic = require('../models/trainingTopic.model');

// class TopicService {
//     async getAllTopics() {
//       return await Topic.find();
//     }
  
//     async createTopic(topicData) {
//       const topic = new Topic(topicData);
//       return await topic.save();
//     }
//   }
  
//   module.exports = new TopicService();


const Topic = require('../models/trainingTopic.model');

class TopicService {
    async getAllTopics() {
        return await Topic.find();
    }

    async createTopic(topicData) {
        const topic = new Topic(topicData);
        console.log("top", topic)
        return await topic.save();
    }

    async updateTopic(id, topicData) {
        return await Topic.findByIdAndUpdate(id, topicData, { new: true });
    }

    async deleteTopic(id) {
        return await Topic.findByIdAndDelete(id);
    }
}

module.exports = new TopicService();
