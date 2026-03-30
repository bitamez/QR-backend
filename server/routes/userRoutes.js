const express = require('express');
const { getUsers, createUser, getProfile, updateProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/profile', verifyToken, getProfile);
router.post('/profile', verifyToken, updateProfile);

module.exports = router;
