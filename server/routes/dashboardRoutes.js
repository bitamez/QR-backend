const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/super-admin', verifyToken, checkRole(['super_admin']), getSuperAdminDashboard);
router.get('/manager/:branchId', verifyToken, getManagerDashboard);

module.exports = router;
