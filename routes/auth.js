const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const router = express.Router();

//Register Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
 try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});
// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

module.exports = router;
