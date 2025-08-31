import User from '../models/User.js';

export const createUser = async (req, res) => {
  try {
    console.log('CREATE USER REQUEST');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const user = new User(req.body);
    await user.save();
    
    console.log('User created successfully:', user.username);
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('CREATE USER ERROR');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.message 
      });
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ 
        error: 'Duplicate field value', 
        details: 'A user with this email or username already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    console.log('GET ALL USERS REQUEST');
    const users = await User.find({}).select('-password');
    console.log('Users found:', users.length);
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const createInitialUser = async (req, res) => {
  try {
    console.log('CREATE INITIAL USER REQUEST');
    
    const existingUser = await User.findOne();
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      firstName: 'Fazle Rabbi',
      lastName: 'Mugdho test',
      username: 'Mugdho_4002',
      email: 'mugdho@gmail.com',
      phone: '+880 1780 803 694',
      location: 'Dhaka, Bangladesh',
      password: '$2a$12$p0/AUEmn31s/0BO4lvFZ3uSNcPilaa0.2SHWpngpt90ZKbncXWUWC',
      role: 'User'
    });

    await user.save();
    console.log('Initial user created successfully');
    res.status(201).json({ message: 'Initial user created successfully', user });
  } catch (error) {
    console.error('Create initial user error:', error.message);
    res.status(500).json({ error: 'Failed to create initial user' });
  }
};

export const getUser = async (req, res) => {
  try {
    console.log('GET USER REQUEST');
    console.log('Username:', req.params.username);
    
    const { username } = req.params;
    
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    }).select('-password');
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', user.username);
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log('UPDATE USER REQUEST');
    console.log('Params:', req.params);
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { username } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    if (updates.password) {
      delete updates.password;
    }

    console.log('Looking for username:', username);
    console.log('Updates to apply:', updates);

    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.username);

    const allowedUpdates = ['firstName', 'lastName', 'email', 'phone', 'location'];
    const updatesToApply = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updatesToApply[key] = updates[key];
      }
    });

    console.log('Updates to apply after filtering:', updatesToApply);

    Object.assign(user, updatesToApply);

    await user.validate();

    const updatedUser = await user.save();
    
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    console.log('User updated successfully');
    res.json({ 
      message: 'User updated successfully', 
      user: userResponse 
    });

  } catch (error) {
    console.error('UPDATE ERROR');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.message 
      });
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ 
        error: 'Duplicate field value', 
        details: 'A user with this email or username already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log('CHANGE PASSWORD REQUEST');
    
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ error: 'Failed to update password' });
  }
};