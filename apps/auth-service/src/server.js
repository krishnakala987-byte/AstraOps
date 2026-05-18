require('dotenv').config();

const express = require('express');

const pool = require('./config/db');

const redisClient = require('./config/redis');

const userRoutes = require('../routes/userRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

/*
  IMPORTANT:
  ALL routes mounted under /api
*/
app.use('/', userRoutes);

app.get('/', (req, res) => {

  res.json({
    message: 'Auth Service Running'
  });

});

app.get('/health', async (req, res) => {

  try {

    await pool.query('SELECT 1');

    await redisClient.ping();

    res.status(200).json({
      service: process.env.SERVICE_NAME,
      status: 'healthy'
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

const startServer = async () => {

  try {

    await pool.query('SELECT NOW()');

    console.log('Database connection successful');

    await redisClient.connect();

    console.log('Redis connection successful');

    app.listen(PORT, () => {

      console.log(`${process.env.SERVICE_NAME} running on port ${PORT}`);

    });

  } catch (error) {

    console.error(error.message);

    process.exit(1);

  }

};

startServer();