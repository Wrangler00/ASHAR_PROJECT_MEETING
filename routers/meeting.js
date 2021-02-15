const express = require('express');
const router = express.Router();

const createMeeting  = require('../controllers/createMeeting');
const getMeetingById = require('../controllers/getMeetingById');
const getAllMeetings = require('../controllers/getAllMeetings');

router.post('/meetings', createMeeting);
router.get('/meeting/:id', getMeetingById);
router.get('/meetings', getAllMeetings);

module.exports = router;