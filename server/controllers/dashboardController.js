const Branch = require('../models/branch');
const Service = require('../models/service');
const Feedback = require('../models/feedback');

const getSuperAdminDashboard = async (req, res, next) => {
  try {
    const totalBranches = await Branch.count();
    const totalServices = await Service.count();
    const feedbackStats = await Feedback.countAndAvg();
    const trendData = await Feedback.findTrend();

    res.json({
      totalBranches,
      totalServices,
      totalFeedback: feedbackStats.count,
      averageRating: feedbackStats.avg,
      trendData
    });
  } catch (err) {
    next(err);
  }
};

const getManagerDashboard = async (req, res, next) => {
  try {
    const { branchId } = req.params;
    
    const stats = await Feedback.getBranchStats(branchId);
    const recentFeedback = await Feedback.getBranchRecent(branchId);

    res.json({
      totalFeedback: stats.count,
      averageRating: stats.avg,
      serviceScore: 4.3, // Mocked for now to match original
      recentFeedback
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSuperAdminDashboard, getManagerDashboard };
