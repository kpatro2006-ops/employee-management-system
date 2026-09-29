import React, { useState } from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { formatSalary } from '../utils/helpers';

export default function EmployeeTable({
  employees,
  loading,
  userRole,
  onEdit,
  onDelete
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const isAdmin = userRole === 'Admin';

  // Filter employees by search and department
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      selectedDept === 'All' || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...new Set(employees.map((e) => e.department))];

  return (
    <div className="table-container">
      {/* Search and Filter Row */}
      <div className="table-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <label>Department:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="filter-select"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-state">Loading employees...</div>
      ) : filteredEmployees.length === 0 ? (
        <div className="empty-state">No employee records found.</div>
      ) : (
        <div className="table-responsive">
          <table className="employee-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Salary (₹ INR)</th>
                <th>Access</th>
                {isAdmin && <th className="text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr key={emp._id}>
                  <td>{index + 1}</td>
                  <td className="font-bold">{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.role}</td>
                  <td>
                    <span className="badge badge-dept">{emp.department}</span>
                  </td>
                  <td>{formatSalary(emp.salary)}</td>
                  <td>
                    <span
                      className={`badge ${
                        emp.userRole === 'Admin' ? 'badge-admin' : 'badge-employee'
                      }`}
                    >
                      {emp.userRole || 'Employee'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="text-center">
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => onEdit(emp)}
                          title="Edit employee"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete "${emp.name}"?`
                              )
                            ) {
                              onDelete(emp._id);
                            }
                          }}
                          title="Delete employee"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
