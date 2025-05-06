const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.code === 11000) {
        // Custom error handling logic
        res.status(400).json({ message: 'Validation Error', error: err.message });
      } else {
        res.status(500).json({ message: 'Server Error', error: err.message });
      }
    throw err;
  }
};

// exports.getUsers = async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// };

exports.getUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments(),
    ]);
  
    res.json({
      totalUsers: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      pageSize: users.length,
      users,
    });
  };


exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('User');
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!user) throw new NotFoundError('User');
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new NotFoundError('User');
  res.status(204).send();
};
