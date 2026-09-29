import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import EmployeeTable from './components/EmployeeTable';
import EmployeeForm from './components/EmployeeForm';
import LoginPage from './components/LoginPage';
import {
  getEmployees,
  getEmployeeStats,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStoredUser,
  logoutUser
} from './services/api';
import { formatSalary } from './utils/helpers';
import { Users, Building, IndianRupee } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3500);
  };

  // Fetch employees
  const loadEmployees = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const res = await getEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch stats
  const loadStats = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await getEmployeeStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn(err);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadEmployees();
      loadStats();
    }
  }, [currentUser, loadEmployees, loadStats]);

  // Login handler
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    showAlert(`Welcome back, ${userData.name}!`, 'success');
  };

  // Logout handler
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setEmployees([]);
    setStats(null);
  };

  // Open Form for Add
  const handleOpenAdd = () => {
    if (currentUser?.userRole !== 'Admin') {
      showAlert('Access Denied: Only Admins can add employees.', 'error');
      return;
    }
    setEmployeeToEdit(null);
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (emp) => {
    if (currentUser?.userRole !== 'Admin') {
      showAlert('Access Denied: Only Admins can edit employees.', 'error');
      return;
    }
    setEmployeeToEdit(emp);
    setIsFormOpen(true);
  };

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = async (formData) => {
    try {
      if (employeeToEdit) {
        await updateEmployee(employeeToEdit._id, formData);
        showAlert(`Employee "${formData.name}" updated successfully!`, 'success');
      } else {
        await createEmployee(formData);
        showAlert(`Employee "${formData.name}" added successfully!`, 'success');
      }
      setIsFormOpen(false);
      setEmployeeToEdit(null);
      await Promise.all([loadEmployees(), loadStats()]);
    } catch (err) {
      throw err;
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (currentUser?.userRole !== 'Admin') {
      showAlert('Access Denied: Only Admins can delete employees.', 'error');
      return;
    }
    try {
      await deleteEmployee(id);
      showAlert('Employee deleted successfully!', 'success');
      await Promise.all([loadEmployees(), loadStats()]);
    } catch (err) {
      showAlert(err.message || 'Failed to delete employee', 'error');
    }
  };

  // If not logged in, show Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Calculate average salary
  const avgSalary =
    employees.length > 0
      ? Math.round(
          employees.reduce((acc, curr) => acc + (curr.salary || 0), 0) /
            employees.length
        )
      : 0;

  return (
    <div className="app-container">
      {/* Navbar with RBAC indicators and actions */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAddModal={handleOpenAdd}
        onRefresh={() => {
          loadEmployees();
          loadStats();
          showAlert('Refreshed employee list', 'success');
        }}
      />

      <main className="main-content">
        {/* Simple Notification Alert */}
        {alert && (
          <div className={`notification-alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            <span>{alert.message}</span>
            <button className="alert-close" onClick={() => setAlert(null)}>&times;</button>
          </div>
        )}

        {/* Basic Stats Cards */}
        <div className="stats-row">
          <div className="mini-stat-card">
            <div className="stat-icon stat-blue">
              <Users size={22} />
            </div>
            <div>
              <div className="stat-number">{employees.length}</div>
              <div className="stat-label">Total Employees</div>
            </div>
          </div>

          <div className="mini-stat-card">
            <div className="stat-icon stat-purple">
              <Building size={22} />
            </div>
            <div>
              <div className="stat-number">
                {new Set(employees.map((e) => e.department)).size}
              </div>
              <div className="stat-label">Departments</div>
            </div>
          </div>

          <div className="mini-stat-card">
            <div className="stat-icon stat-green">
              <IndianRupee size={22} />
            </div>
            <div>
              <div className="stat-number">{formatSalary(avgSalary)}</div>
              <div className="stat-label">Average CTC</div>
            </div>
          </div>
        </div>

        {/* Employee Table with Search & Filter */}
        <EmployeeTable
          employees={employees}
          loading={loading}
          userRole={currentUser?.userRole}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Add / Edit Form Modal */}
      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEmployeeToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        employeeToEdit={employeeToEdit}
      />
    </div>
  );
}
