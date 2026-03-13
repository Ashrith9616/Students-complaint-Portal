// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

// Update student name in header
document.getElementById('studentName').textContent = currentUser.name;

// Add logout functionality
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Store complaints in localStorage
let complaints = JSON.parse(localStorage.getItem('complaints')) || [];

// Initialize suggestions array in localStorage
let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];

// Initialize profile in localStorage if it doesn't exist
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};

// Global variables
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

// Function to show a specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update sidebar button states
    document.querySelectorAll('.sidebar button').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick').includes(sectionId)) {
            button.classList.add('active');
        }
    });
}

// Function to change slides
function changeSlide(direction) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Handle complaint form submission
document.getElementById('complaintForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const complaint = {
        id: Date.now(),
        category: document.getElementById('category').value,
        subject: document.getElementById('subject').value,
        description: document.getElementById('description').value,
        status: 'Pending',
        date: new Date().toLocaleDateString(),
        studentName: currentUser.name,
        studentId: currentUser.studentId
    };
    
    complaints.push(complaint);
    localStorage.setItem('complaints', JSON.stringify(complaints));
    
    // Reset form
    this.reset();
    alert('Complaint submitted successfully! Your complaint ID is: ' + complaint.id);
    
    // Update complaints list
    displayComplaints();
});

// Display complaints in the My Complaints section
function displayComplaints() {
    const complaintsList = document.getElementById('complaintsList');
    complaintsList.innerHTML = '';
    
    // Filter complaints for current user
    const userComplaints = complaints.filter(c => c.studentId === currentUser.studentId);
    
    if (userComplaints.length === 0) {
        complaintsList.innerHTML = '<p>No complaints found.</p>';
        return;
    }
    
    userComplaints.forEach(complaint => {
        const card = document.createElement('div');
        card.className = 'complaint-card';
        card.innerHTML = `
            <h3>${complaint.subject}</h3>
            <p><strong>ID:</strong> ${complaint.id}</p>
            <p><strong>Category:</strong> ${complaint.category}</p>
            <p><strong>Status:</strong> ${complaint.status}</p>
            <p><strong>Date:</strong> ${complaint.date}</p>
            <p><strong>Description:</strong> ${complaint.description}</p>
            <button onclick="generateComplaintPDF(${JSON.stringify(complaint).replace(/"/g, '&quot;')})" class="download-btn">
                <i class="fas fa-download"></i> Download as PDF
            </button>
        `;
        complaintsList.appendChild(card);
    });
}

// Function to generate PDF for a complaint
function generateComplaintPDF(complaint) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text('College Complaint Portal', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Official Complaint Document', 105, 30, { align: 'center' });
    
    // Complaint details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Complaint ID: ${complaint.id}`, 20, 50);
    doc.text(`Date Submitted: ${complaint.date}`, 20, 60);
    doc.text(`Status: ${complaint.status}`, 20, 70);
    doc.text(`Category: ${complaint.category}`, 20, 80);
    doc.text(`Submitted By: ${complaint.studentName || 'Unknown'}`, 20, 90);
    
    // Subject
    doc.setFontSize(14);
    doc.text('Subject:', 20, 110);
    doc.setFontSize(12);
    doc.text(complaint.subject, 20, 120);
    
    // Description
    doc.setFontSize(14);
    doc.text('Description:', 20, 140);
    doc.setFontSize(12);
    const descLines = doc.splitTextToSize(complaint.description, 170);
    doc.text(descLines, 20, 150);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('This is an official document from College Complaint Portal', 105, 280, { align: 'center' });
    doc.text('For any queries, please contact: complaints@college.edu', 105, 285, { align: 'center' });
    
    doc.save(`complaint_${complaint.id}.pdf`);
}

// Track complaint status
function trackComplaint() {
    const complaintId = document.getElementById('complaintId').value;
    const statusResult = document.getElementById('statusResult');
    
    const complaint = complaints.find(c => c.id === parseInt(complaintId));
    
    if (complaint) {
        statusResult.innerHTML = `
            <div class="complaint-card">
                <h3>${complaint.subject}</h3>
                <p><strong>Status:</strong> ${complaint.status}</p>
                <p><strong>Category:</strong> ${complaint.category}</p>
                <p><strong>Date:</strong> ${complaint.date}</p>
                <button onclick="generateComplaintPDF(${JSON.stringify(complaint).replace(/"/g, '&quot;')})" class="download-btn">
                    <i class="fas fa-download"></i> Download as PDF
                </button>
            </div>
        `;
    } else {
        statusResult.innerHTML = '<p>No complaint found with this ID.</p>';
    }
}

// Handle suggestion form submission
document.getElementById('suggestionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const suggestion = {
        id: Date.now(),
        area: document.getElementById('area').value,
        title: document.getElementById('suggestionTitle').value,
        details: document.getElementById('suggestionDetails').value,
        benefits: document.getElementById('benefits').value,
        date: new Date().toLocaleDateString(),
        studentName: currentUser.name,
        studentId: currentUser.studentId,
        votes: 0,
        voters: []
    };
    
    suggestions.push(suggestion);
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
    
    // Reset form
    this.reset();
    alert('Thank you for your suggestion!');
    
    // Update suggestions list
    displaySuggestions();
});

// Display suggestions
function displaySuggestions() {
    const suggestionsList = document.getElementById('suggestionsList');
    if (!suggestionsList) return;
    
    suggestionsList.innerHTML = '';
    
    // Sort suggestions by votes (highest first)
    suggestions.sort((a, b) => b.votes - a.votes);
    
    suggestions.forEach(suggestion => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.innerHTML = `
            <h4>${suggestion.title}</h4>
            <div class="suggestion-meta">
                <span>Area: ${suggestion.area}</span> | 
                <span>By: ${suggestion.studentName}</span> | 
                <span>Date: ${suggestion.date}</span>
            </div>
            <p><strong>Details:</strong> ${suggestion.details}</p>
            <p><strong>Benefits:</strong> ${suggestion.benefits}</p>
            <div class="suggestion-votes">
                <button onclick="voteSuggestion(${suggestion.id})" class="vote-btn">
                    ${suggestion.voters.includes(currentUser.studentId) ? '★' : '☆'}
                    <span class="vote-count">${suggestion.votes}</span> votes
                </button>
            </div>
        `;
        suggestionsList.appendChild(card);
    });
}

// Handle voting on suggestions
function voteSuggestion(suggestionId) {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    const userIndex = suggestion.voters.indexOf(currentUser.studentId);
    
    if (userIndex === -1) {
        // Add vote
        suggestion.votes++;
        suggestion.voters.push(currentUser.studentId);
    } else {
        // Remove vote
        suggestion.votes--;
        suggestion.voters.splice(userIndex, 1);
    }
    
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
    displaySuggestions();
}

// Display profile information
function displayProfile() {
    const profileDetails = document.querySelector('.profile-details');
    if (!profileDetails) return;

    // Set profile initials
    const initials = currentUser.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    document.getElementById('profileInitials').textContent = initials;

    // Display profile information
    profileDetails.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Full Name</div>
            <div class="detail-value">${currentUser.name}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Email</div>
            <div class="detail-value">${currentUser.email}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Student ID</div>
            <div class="detail-value">${currentUser.studentId}</div>
        </div>
    `;
}

// Toggle profile edit mode
function toggleEditMode() {
    const profileDisplay = document.getElementById('profileDisplay');
    const profileForm = document.getElementById('profileForm');
    
    profileDisplay.classList.toggle('hidden');
    profileForm.classList.toggle('hidden');
    
    if (!profileForm.classList.contains('hidden')) {
        // Populate form fields
        document.getElementById('fullName').value = currentUser.name;
        document.getElementById('email').value = currentUser.email;
        document.getElementById('regNumber').value = currentUser.studentId;
    }
}

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Update user data
    currentUser.name = document.getElementById('fullName').value;
    currentUser.email = document.getElementById('email').value;
    currentUser.studentId = document.getElementById('regNumber').value;
    
    // Update in localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update in users array
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update display
    document.getElementById('studentName').textContent = currentUser.name;
    toggleEditMode();
    displayProfile();
});

// Handle password change form
document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (currentPassword !== currentUser.password) {
        alert('Current password is incorrect');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    // Update password
    currentUser.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update in users array
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    alert('Password changed successfully!');
    this.reset();
});

// Toggle password visibility
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard');
    displayComplaints();
    displaySuggestions();
    displayProfile();
    
    // Set up automatic slideshow
    setInterval(() => changeSlide(1), 5000);
});