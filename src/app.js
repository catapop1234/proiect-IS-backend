const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const searchRoutes = require('./routes/searchRoutes');
const placeRoutes = require('./routes/placeRoutes');
const userRoutes = require('./routes/userRoutes');
const placeController = require('./controllers/placeController');
const { authenticate } = require('./middleware/authMiddleware');
const { getRecommendations, nearbyPlaces } = require('./controllers/searchController');

app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/place', placeRoutes);
app.use('/api/user', userRoutes);

app.get('/api/recommendations', authenticate, getRecommendations);
app.post('/api/nearby', authenticate, nearbyPlaces);
app.get('/api/photo', placeController.getPhoto);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, _next) => {
  console.error('Eroare neașteptată:', err);
  res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
});

module.exports = app;
