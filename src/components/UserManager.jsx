import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Shield, UserPlus, Edit2, Trash2, User, X, Check } from 'lucide-react';

const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Kumar (You)',
    username: 'admin',
    designation: 'Marketing Manager',
    role: 'Administrator',
    status: 'Active',
    avatarColor: '#d31e25'
  },
  {
    id: 'user-2',
    name: 'Sales Representative',
    username: 'sales_rep1',
    designation: 'Wholesale Agent',
    role: 'Editor',
    status: 'Active',
    avatarColor: '#3b82f6'
  }
];

export default function UserManager({ onNotify }) {
  const { settings } = useData();

  // Users State with LocalStorage sync
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('zactek_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('zactek_users', JSON.stringify(users));
  }, [users]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('Editor');
  const [password, setPassword] = useState('');

  const handleOpenAddModal = () => {
    setEditId(null);
    setFullName('');
    setUsername('');
    setDesignation('');
    setRole('Editor');
    setPassword('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditId(user.id);
    setFullName(user.name.replace(' (You)', ''));
    setUsername(user.username);
    setDesignation(user.designation);
    setRole(user.role);
    setPassword('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !designation.trim()) {
      onNotify('error', 'Please fill in all required fields.');
      return;
    }

    if (editId) {
      // Edit User
      setUsers(users.map(u => 
        u.id === editId ? {
          ...u,
          name: editId === 'user-1' ? `${fullName.trim()} (You)` : fullName.trim(),
          username: username.trim(),
          designation: designation.trim(),
          role: role
        } : u
      ));
      onNotify('success', `User "${fullName.trim()}" updated successfully!`);
    } else {
      // Add User
      const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newUser = {
        id: `user-${Date.now()}`,
        name: fullName.trim(),
        username: username.trim().toLowerCase(),
        designation: designation.trim(),
        role: role,
        status: 'Active',
        avatarColor: randomColor
      };

      setUsers([...users, newUser]);
      onNotify('success', `User "${fullName.trim()}" added successfully!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteUser = (user) => {
    if (user.id === 'user-1' || user.username === 'admin') {
      onNotify('error', 'Primary Administrator account cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      return;
    }

    setUsers(users.filter(u => u.id !== user.id));
    onNotify('error', `User "${user.name}" removed.`);
  };

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* Top Header */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Users & Roles</h2>
          <p style={styles.subtitle}>Manage system administrators, editors, and marketing representative roles.</p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary" style={styles.headerBtn}>
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      {/* Users Table Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={styles.tableTitle}>
          <Shield size={18} color="var(--color-primary)" /> Active Admin Users ({users.length})
        </h3>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>AVATAR</th>
                <th>NAME</th>
                <th>USERNAME</th>
                <th>DESIGNATION</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th style={{ width: '100px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  {/* AVATAR */}
                  <td>
                    <div className="user-avatar-circle" style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%',
                      backgroundColor: u.avatarColor || '#d31e25',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  </td>

                  {/* NAME */}
                  <td>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{u.name}</strong>
                  </td>

                  {/* USERNAME */}
                  <td>
                    <code>{u.username}</code>
                  </td>

                  {/* DESIGNATION */}
                  <td>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                      {u.designation}
                    </span>
                  </td>

                  {/* ROLE */}
                  <td>
                    {u.role === 'Administrator' ? (
                      <span className="badge badge-primary">Administrator</span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                        {u.role}
                      </span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className="status-badge active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                      {u.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="btn btn-secondary"
                        style={styles.actionBtnIcon}
                        title="Edit User"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="btn btn-danger"
                        style={styles.actionBtnIcon}
                        title="Delete User"
                        disabled={u.id === 'user-1' || u.username === 'admin'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal Overlay */}
      {isModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.formModal} className="glass-panel animate-fade-in">
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>{editId ? 'Edit User Profile' : 'Add New User'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.scrollForm}>
              <div className="form-group">
                <label htmlFor="userFullName">Full Name *</label>
                <input
                  id="userFullName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sales Representative"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div style={styles.grid2}>
                <div className="form-group">
                  <label htmlFor="userUsername">Username *</label>
                  <input
                    id="userUsername"
                    type="text"
                    className="form-control"
                    placeholder="e.g. sales_rep1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="userRole">Role *</label>
                  <select
                    id="userRole"
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="userDesignation">Designation / Title *</label>
                <input
                  id="userDesignation"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Wholesale Agent"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="userPassword">Password {editId ? '(Leave blank to keep unchanged)' : '*'}</label>
                <input
                  id="userPassword"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editId}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editId ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  headerBtn: {
    fontSize: '0.85rem',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tableTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionButtons: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'flex-end',
  },
  actionBtnIcon: {
    padding: '6px 8px',
    minHeight: 'auto',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderColor: 'var(--color-border)'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  formModal: {
    width: '100%',
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0a0d14',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    borderRadius: '16px',
  },
  modalHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  scrollForm: {
    padding: '24px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '16px',
  }
};
