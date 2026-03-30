const express = require('express');
const { getUsers, createUser, getProfile, updateProfile } = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', verifyToken, checkRole(['super_admin']), getUsers);
router.post('/', verifyToken, checkRole(['super_admin']), createUser);
router.get('/profile', verifyToken, getProfile);
router.post('/profile', verifyToken, updateProfile);

module.exports = router;
