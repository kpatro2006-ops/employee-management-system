import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} from '../controllers/employeeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Summary stats - Accessible to all authenticated users (Admin & Employee)
router.get('/stats/summary', protect, getEmployeeStats);

// Employee collection routes
router.route('/')
  .get(protect, getEmployees)                                    // Read: Admin & Employee
  .post(protect, authorize('Admin'), createEmployee);            // Create: Admin ONLY

// Individual employee routes
router.route('/:id')
  .get(protect, getEmployeeById)                                 // Read: Admin & Employee
  .put(protect, authorize('Admin'), updateEmployee)              // Update: Admin ONLY
  .delete(protect, authorize('Admin'), deleteEmployee);          // Delete: Admin ONLY

export default router;
