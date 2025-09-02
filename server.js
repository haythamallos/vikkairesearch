const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Hardcoded users (in production, use a database)
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$QWgdUWphR1nEOvc7ewVWPOoGi1Q/2DuptQN70b8S7o2lKbDdHfPc2', // admin123
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: '$2a$10$uj1.x3TPIZgHJD4DwSjeOecbG18PWFnkGTDB3iEYN3nPZR3AsO.nC', // user123
    role: 'user'
  },
  {
    id: 3,
    username: 'demo',
    password: '$2a$10$b4htRWMxb/e8UcAtMpds6.fBuAkyIh4P/NuTAJS9mmzZHW9V6MdT2', // demo123
    role: 'user'
  }
];

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'vikk-dashboard-secret-key-2024';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Protected route - requires authentication
app.get('/dashboard', (req, res) => {
  // Always serve dashboard page - let client-side handle authentication
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/sample-lawyer-page', (req, res) => {
  // Always serve sample page - let client-side handle authentication
  res.sendFile(path.join(__dirname, 'public', 'sample-lawyer-page.html'));
});

app.get('/clone', (req, res) => {
  // Public clone page - no authentication required
  res.sendFile(path.join(__dirname, 'public', 'clone.html'));
});



// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (using hardcoded hash for demo)
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard data endpoint (protected)
app.get('/api/dashboard', authenticateToken, (req, res) => {
  // Mock dashboard data
  const dashboardData = {
    stats: {
      totalUsers: 1250,
      activeUsers: 892,
      revenue: 45600,
      growth: 12.5
    },
    recentActivity: [
      { id: 1, action: 'New user registered', time: '2 minutes ago', user: 'john.doe' },
      { id: 2, action: 'Payment received', time: '15 minutes ago', user: 'jane.smith' },
      { id: 3, action: 'Support ticket closed', time: '1 hour ago', user: 'admin' },
      { id: 4, action: 'System backup completed', time: '2 hours ago', user: 'system' }
    ],
    charts: {
      monthlyRevenue: [32000, 35000, 38000, 42000, 45000, 45600],
      userGrowth: [1000, 1100, 1200, 1250, 1300, 1350]
    }
  };

  res.json(dashboardData);
});

// User profile endpoint (protected)
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    lastLogin: new Date().toISOString()
  });
});

// Health check endpoint for Azure App Service
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available users:');
  console.log('- admin / admin123');
  console.log('- user / user123');
  console.log('- demo / demo123');
});
