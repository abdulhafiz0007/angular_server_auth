const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET_KEY = 'your_secret_key';
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let users = []; // In-memory user store (for demo)

// Register
app.post('/register', (req, res) => {
  const { username, phone, email, password } = req.body;

  const userExists = users.find(u => u.email === email);
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const newUser = { id: Date.now(), username, phone, email, password };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.status(200).json({ token });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
