const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const Joi = require('joi');
require('dotenv').config();

// Validation function
function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(user);
}
  
// Register a user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate user input
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message.trim() });

  try {
    // Check if user already exists
    const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database 
    const [result] = await pool.query(
      'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // Create JWT token
    const payload = {
      user: { id: result.insertId },
      username,
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const user = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Create JWT token including username
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user data
exports.getUser = async (req, res) => {
  try {
    // Use the ID from the URL parameter
    const userId = req.params.id;
    
    const [rows] = await pool.query('SELECT id, username, email, created_at FROM Users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
  res.json(rows[0]);
  } 
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user data
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, created_at FROM Users');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
  res.json(rows);
  } 
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user data
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const [result] = await pool.query('DELETE FROM Users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User successfully deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
 