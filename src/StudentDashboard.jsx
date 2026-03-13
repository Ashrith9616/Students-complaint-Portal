import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setStudentName(userDoc.data().fullName || 'Student');
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const toggleEditMode = () => {
    setIsEditingProfile(!isEditingProfile);
  };

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

  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    './media/download (1).jpg',
    './media/download.jpg',
    './media/images.jpg',
    './media/download.jpg',
  ];

  const changeSlide = (step) => {
    setCurrentSlide((prev) => (prev + step + images.length) % images.length);
  };

  return (
    <div className="container">
      <header>
        <h1>CAMPUS CARE</h1>
        <p>Welcome, <span id="studentName">{studentName}</span></p>
        <button onClick={handleLogout} className="logout-btn" aria-label="Logout" title="Logout">Logout</button>
      </header>

      <div className="dashboard">
        <div className="sidebar">
          <button onClick={() => setActiveSection('dashboard')} className={activeSection === 'dashboard' ? 'active' : ''} aria-label="Dashboard" title="Dashboard">Dashboard</button>
          <button onClick={() => setActiveSection('profile')} className={activeSection === 'profile' ? 'active' : ''} aria-label="My Profile" title="My Profile">My Profile</button>
          <button onClick={() => setActiveSection('newComplaint')} className={activeSection === 'newComplaint' ? 'active' : ''} aria-label="New Complaint" title="New Complaint">New Complaint</button>
          <button onClick={() => setActiveSection('myComplaints')} className={activeSection === 'myComplaints' ? 'active' : ''} aria-label="My Complaints" title="My Complaints">My Complaints</button>
          <button onClick={() => setActiveSection('trackStatus')} className={activeSection === 'trackStatus' ? 'active' : ''} aria-label="Track Status" title="Track Status">Track Status</button>
          <button onClick={() => setActiveSection('suggestions')} className={activeSection === 'suggestions' ? 'active' : ''} aria-label="Suggestions Box" title="Suggestions Box">Suggestions Box</button>
          <button onClick={() => setActiveSection('changePassword')} className={activeSection === 'changePassword' ? 'active' : ''} aria-label="Change Password" title="Change Password">Change Password</button>
        </div>

        <div className="main-content">
          <section id="dashboard" className={activeSection === 'dashboard' ? 'active' : ''}>
            <h2>Welcome to College Dashboard</h2>
            <div className="dashboard-container">
              <div className="how-it-works">
                <h3>How it Works</h3>
                <div className="steps-container">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <h4>Submit Your Complaint</h4>
                    <p>Choose a category, provide details about your issue, and submit your complaint through our easy-to-use form.</p>
                  </div>
                  <div className="step-card">
                    <div className="step-number">2</div>
                    <h4>Track Progress</h4>
                    <p>Monitor the status of your complaint using the unique complaint ID provided. Get real-time updates on the resolution process.</p>
                  </div>
                  <div className="step-card">
                    <div className="step-number">3</div>
                    <h4>Get Resolution</h4>
                    <p>Receive notifications about actions taken and resolution updates. Provide feedback on the solution provided.</p>
                  </div>
                  <div className="step-card">
                    <div className="step-number">4</div>
                    <h4>Share Suggestions</h4>
                    <p>Help improve the college by sharing your suggestions and voting on others' ideas in the suggestions box.</p>
                  </div>
                </div>
              </div>

              <div className="image-slider">
                <div className="slider-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {images.map((src, idx) => (
                    <img key={idx} src={src} alt={`Slide ${idx}`} className={`slide active`} />
                  ))}
                </div>
                <button className="slider-btn prev" onClick={() => changeSlide(-1)} aria-label="Previous slide" title="Previous slide">❮</button>
                <button className="slider-btn next" onClick={() => changeSlide(1)} aria-label="Next slide" title="Next slide">❯</button>
              </div>

              <div className="rules-section">
                <h3>College Rules & Guidelines</h3>
                <div className="rules-container">
                  <div className="rule-card">
                    <h4>Attendance Policy</h4>
                    <ul>
                      <li>Minimum 75% attendance is mandatory</li>
                      <li>Medical certificates must be submitted within 3 days</li>
                      <li>Parents will be notified if attendance falls below 60%</li>
                    </ul>
                  </div>
                  <div className="rule-card">
                    <h4>Dress Code</h4>
                    <ul>
                      <li>Formal attire is mandatory on all working days</li>
                      <li>ID cards must be worn at all times</li>
                      <li>Lab coat compulsory during practical sessions</li>
                    </ul>
                  </div>
                  <div className="rule-card">
                    <h4>Academic Rules</h4>
                    <ul>
                      <li>Internal assessments are mandatory</li>
                      <li>Assignments must be submitted on time</li>
                      <li>Maintain discipline during lectures</li>
                    </ul>
                  </div>
                  <div className="rule-card">
                    <h4>Campus Guidelines</h4>
                    <ul>
                      <li>No smoking within campus premises</li>
                      <li>Mobile phones must be silent in academic areas</li>
                      <li>Maintain cleanliness in the campus</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="quick-links">
                <h3>Quick Links</h3>
                <div className="links-container">
                  <a href="#" className="quick-link-card">
                    <i className="fas fa-calendar"></i> Academic Calendar
                  </a>
                  <a href="#" className="quick-link-card">
                    <i className="fas fa-book"></i> Library Portal
                  </a>
                  <a href="#" className="quick-link-card">
                    <i className="fas fa-clipboard-list"></i> Exam Schedule
                  </a>
                  <a href="#" className="quick-link-card">
                    <i className="fas fa-newspaper"></i> College News
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section id="newComplaint" className={activeSection === 'newComplaint' ? 'active' : ''}>
            <h2>Submit New Complaint</h2>
            <form id="complaintForm" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select id="category" required>
                  <option value="">Select Category</option>
                  <option value="academic">Academic</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="hostel">Hostel</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input type="text" id="subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" required></textarea>
              </div>
              <button type="submit" aria-label="Submit complaint" title="Submit complaint">Submit Complaint</button>
            </form>
          </section>

          <section id="myComplaints" className={activeSection === 'myComplaints' ? 'active' : ''}>
            <h2>My Complaints</h2>
            <div id="complaintsList"></div>
          </section>

          <section id="trackStatus" className={activeSection === 'trackStatus' ? 'active' : ''}>
            <h2>Track Complaint Status</h2>
            <div className="search-box">
              <input type="text" id="complaintId" placeholder="Enter Complaint ID" />
              <button onClick={() => {}} aria-label="Track complaint status" title="Track complaint status">Track</button>
            </div>
            <div id="statusResult"></div>
          </section>

          <section id="suggestions" className={activeSection === 'suggestions' ? 'active' : ''}>
            <h2>Infrastructure Suggestions Box</h2>
            <div className="suggestions-container">
              <form id="suggestionForm" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="area">Area of Improvement:</label>
                  <select id="area" required>
                    <option value="">Select Area</option>
                    <option value="classroom">Classrooms</option>
                    <option value="laboratory">Laboratories</option>
                    <option value="library">Library</option>
                    <option value="sports">Sports Facilities</option>
                    <option value="canteen">Canteen</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="suggestionTitle">Title:</label>
                  <input type="text" id="suggestionTitle" required placeholder="Brief title for your suggestion" />
                </div>
                <div className="form-group">
                  <label htmlFor="suggestionDetails">Details:</label>
                  <textarea id="suggestionDetails" required placeholder="Describe your suggestion in detail"></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="benefits">Expected Benefits:</label>
                  <textarea id="benefits" required placeholder="How will this improve the college?"></textarea>
                </div>
                <button type="submit" aria-label="Submit suggestion" title="Submit suggestion">Submit Suggestion</button>
              </form>

              <div className="suggestions-list">
                <h3>Recent Suggestions</h3>
                <div id="suggestionsList"></div>
              </div>
            </div>
          </section>

          <section id="profile" className={activeSection === 'profile' ? 'active' : ''}>
            <h2>Student Profile</h2>
            <div className="profile-container">
              <div className="profile-info" id="profileDisplay" style={{ display: isEditingProfile ? 'none' : 'block' }}>
                <div className="profile-header">
                  <div className="profile-avatar">
                    <span id="profileInitials">ST</span>
                  </div>
                  <button onClick={toggleEditMode} className="edit-btn" aria-label="Edit profile" title="Edit profile">Edit Profile</button>
                </div>
                <div className="profile-details">
                  <div className="detail-item"><strong>Full Name:</strong> Student Name</div>
                  <div className="detail-item"><strong>Registration Number:</strong> REG123456</div>
                  <div className="detail-item"><strong>Stream:</strong> Computer Science</div>
                  <div className="detail-item"><strong>Current Year:</strong> 3</div>
                  <div className="detail-item"><strong>Mobile Number:</strong> 9876543210</div>
                  <div className="detail-item"><strong>Email Address:</strong> student@college.edu</div>
                </div>
              </div>

              <form id="profileForm" className={`profile-edit-form ${isEditingProfile ? '' : 'hidden'}`} style={{ display: isEditingProfile ? 'block' : 'none' }}>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" required />
                </div>
                <div className="form-group">
                  <label htmlFor="regNumber">Registration Number</label>
                  <input type="text" id="regNumber" required />
                </div>
                <div className="form-group">
                  <label htmlFor="stream">Stream</label>
                  <select id="stream" required>
                    <option value="">Select Stream</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="year">Current Year</label>
                  <select id="year" required>
                    <option value="">Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input type="tel" id="mobile" pattern="[0-9]{10}" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" required />
                </div>
                <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button type="submit" className="save-btn" aria-label="Save profile changes" title="Save profile changes">Save Changes</button>
                  <button type="button" onClick={toggleEditMode} className="cancel-btn" style={{ background: '#ccc', color: '#333' }} aria-label="Cancel profile edit" title="Cancel profile edit">Cancel</button>
                </div>
              </form>
            </div>
          </section>

          <section id="changePassword" className={activeSection === 'changePassword' ? 'active' : ''}>
            <h2>Change Password</h2>
            <div className="password-section">
              <form id="passwordForm" className="password-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <div className="password-input-group">
                    <input type="password" id="currentPassword" required />
                    <button type="button" className="toggle-password" aria-label="Toggle password visibility" title="Toggle password visibility">
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="password-input-group">
                    <input type="password" id="newPassword" required />
                    <button type="button" className="toggle-password" aria-label="Toggle password visibility" title="Toggle password visibility">
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="password-input-group">
                    <input type="password" id="confirmPassword" required />
                    <button type="button" className="toggle-password" aria-label="Toggle password visibility" title="Toggle password visibility">
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div className="password-requirements">
                  <p>Password must contain:</p>
                  <ul>
                    <li id="length">At least 8 characters</li>
                    <li id="uppercase">One uppercase letter</li>
                    <li id="lowercase">One lowercase letter</li>
                    <li id="number">One number</li>
                    <li id="special">One special character</li>
                  </ul>
                </div>
                <div className="button-group">
                  <button type="submit" className="save-btn" aria-label="Update password" title="Update password">Update Password</button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
