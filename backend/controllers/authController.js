const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user with a specific role (Admin can create users or a signup page)
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Specifically handle admin-controlled staff account creation with custom response messages
exports.registerStaff = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields for staff registration
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Check if user already exists with the given email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'A system account with this email already exists.' });
        }

        // Hash the password securely before saving to database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStaffMember = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newStaffMember.save();

        res.status(201).json({ 
            message: `${role} system account created successfully!`,
            user: {
                id: newStaffMember._id,
                username: newStaffMember.username,
                email: newStaffMember.email,
                role: newStaffMember.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user and generate JWT token containing their role
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Create JWT token including user id, role, and username
        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};