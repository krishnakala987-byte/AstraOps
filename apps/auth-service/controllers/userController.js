const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../src/config/db");

// CREATE USER
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const result = await pool.query(
  `INSERT INTO users (username, email, password, role)
   VALUES ($1, $2, $3, $4)
   RETURNING id, username, email, role, created_at`,
  [username, email, hashedPassword, "user"]
);

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // user not found
    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const user = result.rows[0];

    // compare passwords
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    // invalid password
    if (!validPassword) {
      return res.status(400).json({
        error: "Invalid password",
      });
    }

    // generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "secretkey",
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
};