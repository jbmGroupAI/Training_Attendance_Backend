const trainingTopicService = require('../services/trainingTopicService');

async function getAllTopics(req, res) {
    try {
        const topics = await trainingTopicService.getAllTopics();
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createTopic(req, res) {
    try {
        const topic = await trainingTopicService.createTopic(req.body);
        res.status(201).json(topic);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllTopics,
    createTopic
};