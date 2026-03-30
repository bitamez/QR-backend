const Feedback = require('../models/feedback');
const QrCode = require('../models/qrCode');
const { sendEmail } = require('../utils/emailService');

const submitFeedbackByUrl = async (req, res, next) => {
  try {
    const { qrUrl } = req.params;
    const { rating, comments, contactInfo, deviceHash } = req.body;
    
    let qrCode = await QrCode.findByUrl(qrUrl);
    let qr_id = qrCode ? qrCode.qr_id : 1;

    const feedback = await Feedback.create({
      qr_id,
      rating,
      comments,
      user_email: contactInfo || null,
      device_hash: deviceHash || null
    });

    if (rating <= 3) {
      setImmediate(async () => {
        try {
          const branchName = qrCode ? qrCode.branch_name : 'Unknown Branch';
          const subject = `⚠️ Low Rating Alert (${rating} Stars) - ${branchName}`;
          const text = `A new low rating was just submitted:\n\nRating: ${rating} / 5\nBranch: ${branchName}\nComments: ${comments || 'No comments left.'}\nCustomer Email: ${contactInfo || 'Not provided'}`;
          await sendEmail(process.env.ALERT_EMAIL || 'admin@example.com', subject, text);
        } catch (e) {
          console.error("Could not send email alert:", e.message);
        }
      });
    }

    res.status(201).json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
};

const submitFeedbackLegacy = async (req, res, next) => {
  try {
    const { qr_id, rating, comments, user_email } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating (must be 1-5)' });
    }
    
    let final_qr_id = qr_id || 1; 

    const feedback = await Feedback.create({
      qr_id: final_qr_id,
      rating,
      comments,
      user_email
    });
    
    if (rating <= 3) {
      setImmediate(async () => {
        try {
          const subject = `⚠️ Low Rating Alert (${rating} Stars)`;
          const text = `A new low rating was just submitted:\n\nRating: ${rating} / 5\nEmail: ${user_email || 'Not provided'}\nComments: ${comments || 'No comments left.'}`;
          await sendEmail(process.env.ALERT_EMAIL || 'admin@example.com', subject, text);
        } catch (e) {
          console.error("Could not send email alert:", e.message);
        }
      });
    }

    res.status(201).json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
};

const getReports = async (req, res, next) => {
  try {
    const detailedReport = await Feedback.getDetailedReports();
    const pie = await Feedback.getRatingDistribution();
    res.json({
      detailedReport,
      ratingDistribution: pie.map(r => ({ name: r.name + ' Stars', value: parseInt(r.value) }))
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitFeedbackByUrl, submitFeedbackLegacy, getReports };
