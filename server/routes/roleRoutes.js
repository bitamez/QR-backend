const express = require('express');
const { getRoles, createRole } = require('../controllers/roleController');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', getRoles);
router.post('/', verifyToken, checkRole(['super_admin']), createRole);

module.exports = router;
