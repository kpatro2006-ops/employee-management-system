import Employee from '../models/Employee.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth employee/user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password'
      });
    }

    // Explicitly select password field since it is select: false
    const employee = await Employee.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password'
      });
    }

    // Verify password
    const isMatch = await employee.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password'
      });
    }

    // Check account status
    if (employee.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently inactive. Please contact HR.'
      });
    }

    // Return token and user profile
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        userRole: employee.userRole || 'Employee',
        department: employee.department,
        status: employee.status,
        salary: employee.salary,
        token: generateToken(employee._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await Employee.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
