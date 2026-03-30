const express = require('express');
const { getQrCodeDetails, getQrCodes, createQrCode } = require('../controllers/qrCodeController');
const router = express.Router();

router.get('/qr/:qrUrl', getQrCodeDetails);
router.get('/', getQrCodes);
router.post('/', createQrCode);

module.exports = router;
