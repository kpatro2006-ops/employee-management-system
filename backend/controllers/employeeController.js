import Employee from '../models/Employee.js';

// @desc    Get all employees with optional search and filters
// @route   GET /api/employees
export const getEmployees = async (req, res, next) => {
  try {
    const { search, department, role, status, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = {};

    // Search query matches name, email, role, or department
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { role: searchRegex },
        { department: searchRegex }
      ];
    }

    // Exact filters
    if (department && department !== 'All') {
      filter.department = department;
    }

    if (role && role !== 'All') {
      filter.role = role;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const employees = await Employee.find(filter).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid Employee ID format'
      });
    }
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
export const createEmployee = async (req, res, next) => {
  try {
    const { name, email, role, userRole, department, status, salary, joiningDate } = req.body;

    // Check if email already exists
    if (email) {
      const existing = await Employee.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An employee with this email address already exists'
        });
      }
    }

    const employee = await Employee.create({
      name,
      email,
      role,
      userRole: userRole || 'Employee',
      department,
      status: status || 'Active',
      salary: salary !== undefined && salary !== '' ? Number(salary) : 0,
      joiningDate: joiningDate || Date.now()
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An employee with this email address already exists'
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
export const updateEmployee = async (req, res, next) => {
  try {
    const { name, email, role, userRole, department, status, salary, joiningDate } = req.body;

    // Check if employee exists
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with id ${req.params.id}`
      });
    }

    // Check email uniqueness if email changed
    if (email && email.toLowerCase().trim() !== employee.email.toLowerCase()) {
      const emailExists = await Employee.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: req.params.id }
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'An employee with this email address already exists'
        });
      }
    }

    const updateData = {
      name,
      email,
      role,
      userRole: userRole || employee.userRole,
      department,
      status,
      salary: salary !== undefined && salary !== '' ? Number(salary) : employee.salary,
      joiningDate: joiningDate || employee.joiningDate
    };

    employee = await Employee.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An employee with this email address already exists'
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid Employee ID format'
      });
    }
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with id ${req.params.id}`
      });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Employee "${employee.name}" deleted successfully`,
      data: { id: req.params.id }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid Employee ID format'
      });
    }
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/employees/stats/summary
export const getEmployeeStats = async (req, res, next) => {
  try {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: 'Active' });
    const onLeave = await Employee.countDocuments({ status: 'On Leave' });
    const inactive = await Employee.countDocuments({ status: 'Inactive' });

    // Distinct departments
    const departments = await Employee.distinct('department');
    const roles = await Employee.distinct('role');

    // Aggregate department breakdown
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        onLeave,
        inactive,
        totalDepartments: departments.length,
        totalRoles: roles.length,
        departments,
        roles,
        departmentBreakdown: departmentStats
      }
    });
  } catch (error) {
    next(error);
  }
};
