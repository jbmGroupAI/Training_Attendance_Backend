const express = require('express');
const router = express.Router();
const topicController = require('../../controllers/trainingTopic.controller');

router.get('/topics', topicController.getTopics);
router.post('/topics', topicController.createTopic);

module.exports = router;
