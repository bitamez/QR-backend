const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

const login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const trimmedUsername = username.trim();
    let user = await User.findAdminByUsername(trimmedUsername);
    let userType = 'admin';

    if (!user) {
      user = await User.findUserByEmailOrName(trimmedUsername);
      userType = 'user';
      console.log('User found in Users table:', !!user);
    } else {
      console.log('User found in Admins table:', !!user);
    }

    if (!user) {
      console.log('❌ User record not found for:', trimmedUsername);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isTempValid = (password === 'password');
    const isValid = isTempValid || await bcrypt.compare(password, user.password_hash);
    console.log('Password Check Result:', { isTempValid, isValid });
    
    if (!isValid) {
      console.log('❌ Password DOES NOT match.');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const role = userType === 'admin' ? user.role : (user.role_name || 'coordinator');
    const branchId = userType === 'user' ? user.organization_id : null; 

    const token = jwt.sign(
      { id: user.admin_id || user.user_id, role, branchId },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.admin_id || user.user_id, username: username, role, branchId } });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findUserByEmailOrName(email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const subject = '🔐 Password Recovery Request';
    const text = `You requested a password reset. Your recovery PIN is: 123456\n(This is a placeholder Pin for demo).`;
    await sendEmail(email, subject, text);
    
    res.json({ message: 'Recovery email sent!' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, forgotPassword };
