const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../'));

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create tables if they don't exist
const createTables = () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      memberSince VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  const projectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      technology VARCHAR(100),
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(usersTable);
  db.query(projectsTable);
};

createTables();

// Mock Database (in production, use real database)
const users = [
    {
        id: 1,
        email: 'demo@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'demo123'
        name: 'John Doe',
        memberSince: 'January 2024'
    }
];

// Mock Data
const generateMockData = () => ({
    weather: [
        { location: 'New York', temp: 22, condition: 'Sunny', humidity: 65, windSpeed: 12 },
        { location: 'London', temp: 18, condition: 'Cloudy', humidity: 70, windSpeed: 15 },
        { location: 'Tokyo', temp: 25, condition: 'Partly Cloudy', humidity: 60, windSpeed: 8 }
    ],
    crypto: [
        { symbol: 'BTC', name: 'Bitcoin', price: 45234.56, change24h: 2.5, volume24h: 1234567890 },
        { symbol: 'ETH', name: 'Ethereum', price: 2834.12, change24h: -1.2, volume24h: 987654321 },
        { symbol: 'BNB', name: 'Binance Coin', price: 312.45, change24h: 3.8, volume24h: 456789012 }
    ],
    stocks: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 178.23, change: 1.5 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.67, change: -0.8 },
        { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 2.1 }
    ],
    news: [
        { title: 'Tech Stocks Rally on AI Innovation', source: 'TechCrunch', time: '2 hours ago' },
        { title: 'Cryptocurrency Market Shows Recovery', source: 'CoinDesk', time: '4 hours ago' },
        { title: 'Federal Reserve Announces New Policy', source: 'Reuters', time: '6 hours ago' }
    ]
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            memberSince: user.memberSince
        }
    });
});

app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
    res.json({
        orders: 24,
        totalSpent: 1234,
        wishlistItems: 18,
        averageRating: 4.8,
        recentActivity: [
            { type: 'order', title: 'Order #1234 Placed', time: '2 hours ago' },
            { type: 'wishlist', title: 'Added Wireless Headphones', time: '1 day ago' },
            { type: 'review', title: 'Reviewed Smart Watch Pro', time: '3 days ago' }
        ]
    });
});

app.get('/api/weather', (req, res) => {
    const data = generateMockData();
    res.json(data.weather);
});

app.get('/api/crypto', (req, res) => {
    const data = generateMockData();
    res.json(data.crypto);
});

app.get('/api/stocks', (req, res) => {
    const data = generateMockData();
    res.json(data.stocks);
});

app.get('/api/news', (req, res) => {
    const data = generateMockData();
    res.json(data.news);
});

app.get('/api/analytics', (req, res) => {
    const timeRange = req.query.range || '24h';
    const dataPoints = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : 7;
    
    res.json({
        priceTrends: Array.from({ length: dataPoints }, () => Math.random() * 50000 + 40000),
        volumeData: Array.from({ length: dataPoints }, () => Math.random() * 1000000000 + 500000000),
        metrics: {
            totalVolume: '$2.5B',
            activeTraders: '45.2K',
            marketCap: '$850B',
            high24h: '$52,450'
        }
    });
});

// CMS API Routes
app.get('/api/content', (req, res) => {
    const content = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        title: `Content Item ${i + 1}`,
        type: ['page', 'post', 'product', 'category'][Math.floor(Math.random() * 4)],
        status: ['published', 'draft', 'archived'][Math.floor(Math.random() * 3)],
        description: `This is a sample content item with rich description.`,
        image: `https://picsum.photos/seed/content${i + 1}/400/300`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }));
    res.json(content);
});

app.post('/api/content', (req, res) => {
    const newContent = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    res.json(newContent);
});

app.put('/api/content/:id', (req, res) => {
    const { id } = req.params;
    res.json({
        id: parseInt(id),
        ...req.body,
        updatedAt: new Date()
    });
});

app.delete('/api/content/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Content ${id} deleted successfully` });
});

// E-commerce API Routes
app.get('/api/products', (req, res) => {
    const products = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 500) + 20,
        category: ['electronics', 'clothing', 'home', 'sports'][Math.floor(Math.random() * 4)],
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 500) + 10,
        image: `https://picsum.photos/seed/product${i + 1}/300/200`,
        stock: Math.floor(Math.random() * 20) + 5
    }));
    res.json(products);
});

app.post('/api/cart', (req, res) => {
    const { items, userInfo } = req.body;
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;
    
    res.json({
        orderId: 'ORD' + Date.now(),
        items,
        subtotal,
        tax,
        shipping,
        total,
        message: 'Order placed successfully!'
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📱 Frontend available at http://localhost:${PORT}/projects/`);
});

module.exports = app;
