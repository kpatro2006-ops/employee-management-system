import React from 'react';
import { Users, UserPlus, Database, RefreshCw, LogOut, Shield, ShieldAlert, Eye } from 'lucide-react';
import { getInitials, getAvatarColor } from '../utils/helpers';

export default function Navbar({
  currentUser,
  onLogout,
  onOpenAddModal,
  totalEmployees,
  onRefresh,
  isRefreshing
}) {
  const initials = currentUser ? getInitials(currentUser.name) : 'U';
  const avatarBg = currentUser ? getAvatarColor(currentUser.name) : '#4f46e5';
  const isAdmin = currentUser?.userRole === 'Admin';

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <Users size={24} />
          </div>
          <div className="brand-text">
            <h1>StaffPulse</h1>
            <span className="brand-subtitle">MERN Employee Management</span>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Tech Stack Indicator */}
          <div className="system-pill" title="MERN Stack Active">
            <span className="status-dot"></span>
            <Database size={14} className="status-icon" />
            <span>MongoDB &bull; Express &bull; React &bull; Node</span>
          </div>

          {/* Refresh Button */}
          <button 
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh employees list"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            <span className="btn-text">Refresh</span>
          </button>

          {/* RBAC: Add Employee Button - Admin ONLY */}
          {isAdmin ? (
            <button 
              className="btn btn-primary btn-icon"
              onClick={onOpenAddModal}
              id="add-employee-btn"
              title="Add a new employee to records"
            >
              <UserPlus size={18} />
              <span>Add Employee</span>
            </button>
          ) : (
            <div className="rbac-readonly-indicator" title="Logged in as Employee: Read-only access enabled">
              <Eye size={14} />
              <span>Read-Only Mode</span>
            </div>
          )}

          {/* Logged in Employee Profile & Logout */}
          {currentUser && (
            <div className="user-profile-menu">
              <div
                className="user-nav-avatar"
                style={{ backgroundColor: avatarBg }}
                title={currentUser.email}
              >
                {initials}
              </div>
              <div className="user-nav-info">
                <div className="user-nav-header-row">
                  <span className="user-nav-name">{currentUser.name}</span>
                  <span className={`rbac-badge ${isAdmin ? 'rbac-badge-admin' : 'rbac-badge-employee'}`}>
                    {isAdmin ? '👑 Admin' : '👤 Employee'}
                  </span>
                </div>
                <span className="user-nav-role">{currentUser.role}</span>
              </div>
              <button
                className="btn btn-ghost btn-sm btn-logout"
                onClick={onLogout}
                title="Sign out of portal"
              >
                <LogOut size={16} />
                <span className="btn-text">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
