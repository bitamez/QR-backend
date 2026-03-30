const express = require('express');
const { submitFeedbackByUrl, submitFeedbackLegacy, getReports } = require('../controllers/feedbackController');
const { getQrCodeDetails } = require('../controllers/qrCodeController'); // For backwards compatibility
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.get('/qr/:qrUrl', getQrCodeDetails);
router.post('/submit/:qrUrl', submitFeedbackByUrl);
router.post('/', submitFeedbackLegacy);
router.get('/reports', verifyToken, getReports);

module.exports = router;
