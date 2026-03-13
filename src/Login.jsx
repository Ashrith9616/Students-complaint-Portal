import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function Login() {
  const [activeForm, setActiveForm] = useState('login');
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dynamically load the legacy CSS for Login
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/login-styles.css';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const showForm = (formName) => {
    setActiveForm(formName);
    setError(null);
    setEmail('');
    setPassword('');
    setFullName('');
    setStudentId('');
    setConfirmPassword('');
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists() && userDoc.data().role === 'student') {
        navigate('/dashboard');
      } else {
        setError('Not authorized as a student.');
        auth.signOut();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStudentRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        studentId,
        role: 'student',
        createdAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        navigate('/admin');
      } else {
        setError('Not authorized as an admin.');
        auth.signOut();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-nav">
          <button
            className={`nav-btn ${activeForm === 'login' || activeForm === 'register' ? 'active' : ''}`}
            onClick={() => showForm('login')}
          >
            Student Login
          </button>
          <button
            className={`nav-btn ${activeForm === 'adminLogin' || activeForm === 'adminRegister' ? 'active' : ''}`}
            onClick={() => showForm('adminLogin')}
          >
            Admin Login
          </button>
        </div>

        {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</div>}

        {/* Student Login Form */}
        <form id="loginForm" className={activeForm === 'login' ? 'active' : ''} onSubmit={handleStudentLogin}>
          <h2>Student Login</h2>
          <div className="form-group">
            <label htmlFor="loginEmail">Email</label>
            <input type="email" id="loginEmail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input type="password" id="loginPassword" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Login</button>
          <div className="admin-register-link">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); showForm('register'); }}>Register here</a>
          </div>
        </form>

        {/* Student Registration Form */}
        <form id="registerForm" className={activeForm === 'register' ? 'active' : ''} onSubmit={handleStudentRegister}>
          <h2>Student Registration</h2>
          <div className="form-group">
            <label htmlFor="regName">Full Name</label>
            <input type="text" id="regName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="regEmail">Email</label>
            <input type="email" id="regEmail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="regStudentId">Student ID</label>
            <input type="text" id="regStudentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="regPassword">Password</label>
            <input type="password" id="regPassword" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="regConfirmPassword">Confirm Password</label>
            <input type="password" id="regConfirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <div className="password-requirements">
            <p>Password must contain at least 6 characters (Firebase default requirement).</p>
          </div>
          <button type="submit">Register</button>
          <div className="admin-login-link">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); showForm('login'); }}>Login here</a>
          </div>
        </form>

        {/* Admin Login Form */}
        <form id="adminLoginForm" className={activeForm === 'adminLogin' ? 'active' : ''} onSubmit={handleAdminLogin}>
          <h2>Admin Login</h2>
          <div className="form-group">
            <label htmlFor="adminEmail">Admin Email</label>
            <input type="email" id="adminEmail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="adminPassword">Password</label>
            <input type="password" id="adminPassword" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Login</button>
          <div className="admin-register-link">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); showForm('adminRegister'); }}>Register here</a>
          </div>
        </form>

        {/* Admin Registration Form */}
        <form id="adminRegisterForm" className={activeForm === 'adminRegister' ? 'active' : ''} onSubmit={handleAdminRegister}>
          <h2>Admin Registration</h2>
          <div className="form-group">
            <label htmlFor="adminRegName">Full Name</label>
            <input type="text" id="adminRegName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="adminRegEmail">Admin Email</label>
            <input type="email" id="adminRegEmail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="adminRegPassword">Password</label>
            <input type="password" id="adminRegPassword" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="adminRegConfirmPassword">Confirm Password</label>
            <input type="password" id="adminRegConfirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <div className="password-requirements">
            <p>Password must contain at least 6 characters (Firebase default requirement).</p>
          </div>
          <button type="submit">Register</button>
          <div className="admin-login-link">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); showForm('adminLogin'); }}>Login here</a>
          </div>
        </form>
      </div>
    </div>
  );
}
