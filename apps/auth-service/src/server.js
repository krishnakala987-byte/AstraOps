require('dotenv').config();

const express = require('express');

const pool = require('./config/db');

const userRoutes = require('../routes/userRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', userRoutes);

app.get('/health', async (req, res) => {

  try {

    await pool.query('SELECT 1');

    res.status(200).json({
      service: process.env.SERVICE_NAME,
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });

  } catch (error) {

    res.status(500).json({
      service: process.env.SERVICE_NAME,
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });

  }

});

app.get('/', (req, res) => {

  res.json({
    message: 'Auth Service Running'
  });

});

app.listen(PORT, async () => {

  console.log(`${process.env.SERVICE_NAME} running on port ${PORT}`);

  try {

    await pool.query('SELECT NOW()');

    console.log('Database connection successful');

  } catch (error) {

    console.error('Database connection failed:', error.message);

  }

});