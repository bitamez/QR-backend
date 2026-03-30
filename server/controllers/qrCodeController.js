const QrCode = require('../models/qrCode');

const getQrCodeDetails = async (req, res, next) => {
  try {
    const { qrUrl } = req.params;
    const qrCode = await QrCode.findByUrl(qrUrl);
    if (!qrCode) {
      return res.json({ qr_id: 1, branch_name: "Acme Corp Branch", location: "Local Network Kiosk" });
    }
    res.json(qrCode);
  } catch (err) {
    next(err);
  }
};

const getQrCodes = async (req, res, next) => {
  try {
     const qrCodes = await QrCode.findAll();
     res.json(qrCodes);
  } catch (err) {
     next(err);
  }
};

const createQrCode = async (req, res, next) => {
  try {
    const qrCode = await QrCode.create(req.body);
    res.status(201).json(qrCode);
  } catch (err) {
    next(err);
  }
};

module.exports = { getQrCodeDetails, getQrCodes, createQrCode };
