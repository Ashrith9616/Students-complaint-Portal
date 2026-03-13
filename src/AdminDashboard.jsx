import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('adminDashboard');
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setAdminName(userDoc.data().fullName || 'Admin');
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Dynamically load the exact legacy CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/styles.css';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  return (
    <div className="container">
      <header>
        <h1>ADMIN Dashboard</h1>
        <p>Welcome, <span id="studentName">{adminName}</span></p>
        <button onClick={handleLogout} className="logout-btn" aria-label="Logout" title="Logout">Logout</button>
      </header>
      
      <div id="css-test" style={{ display: 'none' }}>CSS Loaded</div>
      <div className="dashboard">
        <div className="sidebar">
          <h3 style={{ color: 'white', padding: '10px' }}>Admin Menu</h3>
          <button onClick={() => setActiveSection('adminDashboard')} className={activeSection === 'adminDashboard' ? 'active' : ''} aria-label="Dashboard" title="Dashboard">Dashboard</button>
          <button onClick={() => setActiveSection('adminComplaints')} className={activeSection === 'adminComplaints' ? 'active' : ''} aria-label="Complaints" title="Complaints">Complaints</button>
          <button onClick={() => setActiveSection('adminSuggestions')} className={activeSection === 'adminSuggestions' ? 'active' : ''} aria-label="Suggestions" title="Suggestions">Suggestions</button>
          <button onClick={() => setActiveSection('adminUsers')} className={activeSection === 'adminUsers' ? 'active' : ''} aria-label="User Management" title="User Management">User Management</button>
          <button onClick={handleLogout} aria-label="Logout" title="Logout">Logout</button>
        </div>
        
        <div className="main-content">
          <div style={{ textAlign: 'right', margin: '10px' }}>
            <button 
              onClick={() => alert('Check browser console for debug info')} 
              style={{ padding: '5px 10px', background: '#f0f0f0', border: '1px solid #ccc', color: 'black' }}
            >
              Debug Info
            </button>
          </div>
          
          <section id="adminDashboard" className={activeSection === 'adminDashboard' ? 'active' : ''}>
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Complaints</h3>
                <p id="totalComplaints">0</p>
              </div>
              <div className="stat-card">
                <h3>Pending Complaints</h3>
                <p id="pendingComplaints">0</p>
              </div>
              <div className="stat-card">
                <h3>Resolved Complaints</h3>
                <p id="resolvedComplaints">0</p>
              </div>
              <div className="stat-card">
                <h3>Total Suggestions</h3>
                <p id="totalSuggestions">0</p>
              </div>
            </div>
          </section>

          <section id="adminComplaints" className={activeSection === 'adminComplaints' ? 'active' : ''}>
            <h2>All Complaints</h2>
            <div className="filter-container">
              <select id="complaintFilter" aria-label="Filter complaints by status">
                <option value="all">All Complaints</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div id="allComplaintsList" className="complaints-list"></div>
          </section>

          <section id="adminSuggestions" className={activeSection === 'adminSuggestions' ? 'active' : ''}>
            <h2>Student Suggestions</h2>
            <div id="allSuggestionsList" className="suggestions-list"></div>
          </section>

          <section id="adminUsers" className={activeSection === 'adminUsers' ? 'active' : ''}>
            <h2>Manage Users</h2>
            <div className="search-container">
              <input type="text" id="userSearch" placeholder="Search users..." />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Student ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="usersList"></tbody>
            </table>
          </section>

          <section id="adminSettings" className={activeSection === 'adminSettings' ? 'active' : ''}>
            <h2>Settings</h2>
            <form id="adminSettingsForm" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="adminEmailSetting">Email</label>
                <input type="email" id="adminEmailSetting" required />
              </div>
              <div className="form-group">
                <label htmlFor="adminPasswordSetting">New Password</label>
                <input type="password" id="adminPasswordSetting" />
              </div>
              <div className="form-group">
                <label htmlFor="adminPasswordConfirm">Confirm Password</label>
                <input type="password" id="adminPasswordConfirm" />
              </div>
              <button type="submit">Save Settings</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
