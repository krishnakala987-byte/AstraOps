const pool = require('../src/config/db');

const redisClient = require('../src/config/redis');

const createUser = async (req, res) => {

  try {

    const { username, email } = req.body;

    const result = await pool.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
      [username, email]
    );

    const user = result.rows[0];

    await redisClient.set(
      `user:${user.id}`,
      JSON.stringify(user),
      {
        EX: 3600
      }
    );

    res.status(201).json({
      message: 'User created successfully',
      user
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const getUser = async (req, res) => {

  try {

    const { id } = req.params;

    const cachedUser = await redisClient.get(`user:${id}`);

    if (cachedUser) {

      return res.status(200).json({
        source: 'redis-cache',
        user: JSON.parse(cachedUser)
      });

    }

    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        message: 'User not found'
      });

    }

    const user = result.rows[0];

    await redisClient.set(
      `user:${id}`,
      JSON.stringify(user),
      {
        EX: 3600
      }
    );

    res.status(200).json({
      source: 'postgres',
      user
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

module.exports = {
  createUser,
  getUser
};