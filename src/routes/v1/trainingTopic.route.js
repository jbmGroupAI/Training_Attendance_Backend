const express = require('express');
const router = express.Router();
const trainingTopicController = require('../controllers/trainingTopicController');

// GET all topics
router.get('/', trainingTopicController.getAllTopics);

// POST a new topic
router.post('/', trainingTopicController.createTopic);

module.exports = router;