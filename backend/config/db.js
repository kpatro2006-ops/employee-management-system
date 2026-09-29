import mongoose from 'mongoose';
import Employee from '../models/Employee.js';

let mongodInstance = null;

const seedEmployees = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    password: 'Employee@123',
    role: 'Senior Full Stack Engineer',
    department: 'Engineering',
    status: 'Active',
    salary: 1850000,
    joiningDate: new Date('2023-01-15')
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    password: 'Employee@123',
    role: 'Product Manager',
    department: 'Product',
    status: 'Active',
    salary: 2400000,
    joiningDate: new Date('2022-06-20')
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    password: 'Employee@123',
    role: 'UI/UX Designer',
    department: 'Design',
    status: 'Active',
    salary: 1400000,
    joiningDate: new Date('2023-03-10')
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    password: 'Employee@123',
    role: 'HR Specialist',
    department: 'Human Resources',
    status: 'Active',
    salary: 950000,
    joiningDate: new Date('2022-11-01')
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'Employee@123',
    role: 'DevOps & Cloud Engineer',
    department: 'Engineering',
    status: 'Active',
    salary: 2100000,
    joiningDate: new Date('2023-08-14')
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    password: 'Employee@123',
    role: 'Marketing Lead',
    department: 'Marketing',
    status: 'On Leave',
    salary: 1250000,
    joiningDate: new Date('2022-09-18')
  },
  {
    name: 'Kabir Verma',
    email: 'kabir.verma@example.com',
    password: 'Employee@123',
    role: 'QA Automation Engineer',
    department: 'Engineering',
    status: 'Active',
    salary: 1100000,
    joiningDate: new Date('2024-02-01')
  },
  {
    name: 'Meera Nair',
    email: 'meera.nair@example.com',
    password: 'Employee@123',
    role: 'Finance Analyst',
    department: 'Finance',
    status: 'Inactive',
    salary: 1050000,
    joiningDate: new Date('2023-05-12')
  },
  {
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'Admin@123',
    role: 'HR Director & Admin',
    userRole: 'Admin',
    department: 'Human Resources',
    status: 'Active',
    salary: 2800000,
    joiningDate: new Date('2021-01-01')
  }
];

const seedDataIfEmpty = async () => {
  const count = await Employee.countDocuments();
  if (count === 0) {
    console.log('🌱 Seeding initial employee records into MongoDB...');
    for (const emp of seedEmployees) {
      await Employee.create(emp);
    }
    console.log(`✅ Seeded ${seedEmployees.length} initial employees with hashed passwords.`);
  }
};

export const connectDB = async () => {
  const specifiedUri = process.env.MONGO_URI;

  // 1. If explicit MONGO_URI is given (e.g. Atlas or specific URL)
  if (specifiedUri && !specifiedUri.includes('127.0.0.1') && !specifiedUri.includes('localhost')) {
    try {
      const conn = await mongoose.connect(specifiedUri, { serverSelectionTimeoutMS: 8000 });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      await seedDataIfEmpty();
      return true;
    } catch (err) {
      console.error(`❌ Failed to connect to specified MONGO_URI: ${err.message}`);
    }
  }

  // 2. Try connecting to local MongoDB first
  const localUri = specifiedUri || 'mongodb://127.0.0.1:27017/employee_management';
  try {
    const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
    await seedDataIfEmpty();
    return true;
  } catch (err) {
    console.log(`ℹ️  Local MongoDB daemon not running (${err.message}). Starting MongoMemoryServer...`);
  }

  // 3. Fallback to MongoMemoryServer for instant, zero-setup local execution
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();

    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ MongoDB In-Memory Server Active: ${conn.connection.host} (${memoryUri})`);
    console.log(`💡 Note: Using in-memory MongoDB. To persist data to MongoDB Atlas or local MongoDB, set MONGO_URI in backend/.env`);
    await seedDataIfEmpty();
    return true;
  } catch (memErr) {
    console.error(`❌ Failed to initialize MongoDB In-Memory Server: ${memErr.message}`);
    return false;
  }
};

// Graceful cleanup
export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
