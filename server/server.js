require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db.js');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes'); // Switched to new MVC
const organizationRoutes = require('./routes/organizationRoutes');
const branchRoutes = require('./routes/branchRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const qrCodeRoutes = require('./routes/qrCodeRoutes');
const errorHandler = require('./middleware/errorHandler');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Main App Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/services', serviceRoutes);
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/qrcodes', qrCodeRoutes);

app.use(errorHandler);

// Basic health check route
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await db.from('organizations').select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ status: 'ok', db: 'supabase_connected', timestamp: new Date() });
  } catch (err) {
    res.json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

// Serve the React frontend for all other requests
app.get('/:any*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Start the server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
