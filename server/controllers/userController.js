import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

export const createUser = async (req, res) => {
  try {
    console.log('CREATE USER REQUEST');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

   
    const { firstName, lastName, username, email, phone, location, password } = req.body;
    
   
    if (!firstName || !lastName || !username || !email || !phone || !location || !password) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: 'All fields are required' 
      });
    }

    console.log('📝 Raw password received:', password);

    
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Duplicate field value', 
        details: 'A user with this email or username already exists' 
      });
    }

    
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      location: location.trim(),
      password: password
    });

    console.log('🔍 User object password before save:', user.password);
    
    await user.save();
    
    console.log('✅ User created successfully:', user.username);
    console.log('🔒 Final hashed password in DB:', user.password);
    
    const userResponse = user.toSafeObject();
    
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('CREATE USER ERROR');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.join(', ') 
      });
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
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

export const loginUser = async (req, res) => {
  try {
    console.log('LOGIN USER REQUEST');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log('Login failed: User not found with email:', email);
      return res.status(400).json({ 
        error: 'Authentication failed', 
        details: 'Invalid email or password' 
      });
    }

    console.log('Comparing password for user:', user.username);
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for user:', user.username);
      return res.status(400).json({ 
        error: 'Authentication failed', 
        details: 'Invalid email or password' 
      });
    }

    const token = generateToken(user._id.toString());
    console.log('✅ Generated token for user ID:', user._id.toString());

    const userResponse = user.toSafeObject();
    
    console.log('Login successful for user:', user.username);
    
    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('LOGIN USER ERROR');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Server error during login' 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    console.log('GET ALL USERS REQUEST');
    const users = await User.find({}).select('-password -__v');
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

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = new User({
      firstName: 'Fazle Rabbi',
      lastName: 'Mugdho',
      username: 'mugdho_4002',
      email: 'mugdho@gmail.com',
      phone: '+8801780803694',
      location: 'Dhaka, Bangladesh',
      password: hashedPassword,
      role: 'User'
    });

    await user.save();
    console.log('Initial user created successfully');
    
    const userResponse = user.toSafeObject();
    
    res.status(201).json({ 
      message: 'Initial user created successfully', 
      user: userResponse 
    });
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
    }).select('-password -__v');
    
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
    
    const userResponse = updatedUser.toSafeObject();

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
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.join(', ') 
      });
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
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

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ error: 'Failed to update password' });
  }
};