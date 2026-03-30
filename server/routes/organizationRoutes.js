const express = require('express');
const { getOrganizations, createOrganization } = require('../controllers/organizationController');
const router = express.Router();

router.get('/', getOrganizations);
router.post('/', createOrganization);

module.exports = router;
