const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'usersdb',
  password: 'Pass@word',
  port: 5432,
});

// Test DB connection
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ DB connection error:', err));

// ---------------- ROUTES ----------------

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, mobile, department, role, work_location } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, mobile, department, role, work_location)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, email, mobile, department, role, work_location]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while adding user' });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, department, role, work_location } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, mobile=$3, department=$4, role=$5, work_location=$6
       WHERE id=$7 RETURNING *`,
      [name, email, mobile, department, role, work_location, id]
    );

    if (result.rows.length === 0) return res.status(404).send('User not found');

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('User not found');
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
