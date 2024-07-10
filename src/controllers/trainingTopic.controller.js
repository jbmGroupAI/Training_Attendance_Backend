// const trainingTopicService = require('../services/trainingTopic.service');
// const httpStatus = require('http-status');
// const catchAsync = require('../utils/catchAsync');
// async function getTopics(req, res) {
//     try {
//         const topics = await trainingTopicService.getAllTopics();
//         res.json(topics);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// async function createTopic(req, res) {
//     try {
//         console.log(req.body)
//         const topic = await trainingTopicService.createTopic(req.body);
//         res.status(201).json(topic);
//     } catch (error) {
//         console.log(error.message)
//         res.status(400).json({ message: error.message });
//     }
// }

// module.exports = {
//     getTopics,
//     createTopic
// };


const trainingTopicService = require('../services/trainingTopic.service');
const httpStatus = require('http-status');

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
        console.log(req.body);
        const topic = await trainingTopicService.createTopic(req.body);
        res.status(201).json(topic);
    } catch (error) {
        console.log(error.message);
        if (error.code === 11000) {
            // Duplicate key error
            res.status(400).json({ message: 'A topic with this name already exists.' });
        } else {
            // Other errors
            res.status(400).json({ message: error.message });
        }
    }
}

async function updateTopic(req, res) {
    try {
        const { id } = req.params;
        const updatedTopic = await trainingTopicService.updateTopic(id, req.body);
        if (!updatedTopic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        res.json(updatedTopic);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

async function deleteTopic(req, res) {
    try {
        const { id } = req.params;
        const deletedTopic = await trainingTopicService.deleteTopic(id);
        if (!deletedTopic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        res.json({ message: 'Topic deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getTopics,
    createTopic,
    updateTopic,
    deleteTopic
};
