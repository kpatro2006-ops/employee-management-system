import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Product',
  'Marketing',
  'Design',
  'Sales',
  'Finance'
];

export default function EmployeeForm({
  isOpen,
  onClose,
  onSubmit,
  employeeToEdit = null
}) {
  const isEditing = Boolean(employeeToEdit);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    salary: '',
    userRole: 'Employee'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || '',
        email: employeeToEdit.email || '',
        role: employeeToEdit.role || '',
        department: employeeToEdit.department || 'Engineering',
        salary: employeeToEdit.salary || '',
        userRole: employeeToEdit.userRole || 'Employee'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        department: 'Engineering',
        salary: '',
        userRole: 'Employee'
      });
    }
    setError('');
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      setError('Please fill in all required fields (Name, Email, Role)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        ...formData,
        salary: formData.salary ? Number(formData.salary) : 0
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. rahul@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Role / Job Title *</label>
            <input
              type="text"
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>System Role (RBAC)</label>
              <select
                name="userRole"
                className="form-select"
                value={formData.userRole}
                onChange={handleChange}
              >
                <option value="Employee">Employee (Read Only)</option>
                <option value="Admin">Admin (Full Access)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Annual Salary (₹ INR)</label>
            <input
              type="number"
              name="salary"
              min="0"
              className="form-input"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 850000"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
