// const express = require('express');
// const router = express.Router();
// const topicController = require('../../controllers/trainingTopic.controller');

// router.get('/topics', topicController.getTopics);
// router.post('/topics', topicController.createTopic);

// module.exports = router;


const express = require('express');
const router = express.Router();
const topicController = require('../../controllers/trainingTopic.controller');

router.get('/', topicController.getTopics);
router.post('/', topicController.createTopic);
router.put('/:id', topicController.updateTopic);
router.delete('/:id', topicController.deleteTopic);

module.exports = router;
