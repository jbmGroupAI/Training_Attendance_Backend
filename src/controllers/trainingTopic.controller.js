const trainingTopicService = require('../services/trainingTopic.service');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
async function getTopics(req, res) {
    try {
        const topics = await trainingTopicService.getAllTopics();
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createTopic(req, res) {
    try {
        console.log(req.body)
        const topic = await trainingTopicService.createTopic(req.body);
        res.status(201).json(topic);
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getTopics,
    createTopic
};
