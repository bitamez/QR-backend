const express = require('express');
const { getSuperAdminDashboard, getManagerDashboard } = require('../controllers/dashboardController');
const router = express.Router();

router.get('/super-admin', getSuperAdminDashboard);
router.get('/manager/:branchId', getManagerDashboard);

module.exports = router;
