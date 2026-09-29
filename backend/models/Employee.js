import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Employee email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      default: 'Employee@123',
      select: false
    },
    role: {
      type: String,
      required: [true, 'Role/Job title is required'],
      trim: true,
      maxlength: [80, 'Role cannot exceed 80 characters']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [80, 'Department cannot exceed 80 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'On Leave', 'Inactive'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Active'
    },
    userRole: {
      type: String,
      enum: {
        values: ['Admin', 'Employee'],
        message: '{VALUE} is not a valid user role'
      },
      default: 'Employee'
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
      default: 0
    },
    joiningDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving if modified or unhashed
employeeSchema.pre('save', async function (next) {
  if (!this.password) {
    this.password = 'Employee@123';
  }
  // If already hashed with bcrypt, skip
  if (!this.isModified('password') && this.password.startsWith('$2')) {
    return next();
  }
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Index for fast search
employeeSchema.index({ name: 'text', role: 'text', department: 'text' });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
