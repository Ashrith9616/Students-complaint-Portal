// Check if admin is logged in
const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
if (!currentAdmin) {
    console.error('No admin logged in - redirecting to login');
    alert('Please login as admin first');
    window.location.href = 'login.html';
} else {
    console.log('Admin logged in:', currentAdmin);
    console.log('localStorage contents:', JSON.stringify(localStorage, null, 2));
}

// Update admin name in header
document.getElementById('adminName').textContent = currentAdmin.name;

// Admin logout function
function adminLogout() {
    localStorage.removeItem('currentAdmin');
    window.location.href = 'login.html';
}

// Function to show admin sections
function showAdminSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.main-content section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(`admin${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`).classList.add('active');
    
    // Update sidebar button states
    document.querySelectorAll('.sidebar button').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick').includes(sectionId)) {
            button.classList.add('active');
        }
    });
    
    // Load data for the section
    switch(sectionId) {
        case 'complaints':
            loadAllComplaints();
            break;
        case 'suggestions':
            loadAllSuggestions();
            break;
        case 'users':
            loadAllUsers();
            break;
        case 'dashboard':
            loadAdminStats();
            break;
    }
}

// Load admin dashboard statistics
function loadAdminStats() {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    const suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    
    document.getElementById('totalComplaints').textContent = complaints.length;
    document.getElementById('pendingComplaints').textContent = complaints.filter(c => c.status === 'Pending').length;
    document.getElementById('resolvedComplaints').textContent = complaints.filter(c => c.status === 'Resolved').length;
    document.getElementById('totalSuggestions').textContent = suggestions.length;
}

// Load all complaints for admin
function loadAllComplaints() {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    const complaintsList = document.getElementById('allComplaintsList');
    complaintsList.innerHTML = '';
    
    if (complaints.length === 0) {
        complaintsList.innerHTML = '<p>No complaints found.</p>';
        return;
    }
    
    complaints.forEach(complaint => {
        const card = document.createElement('div');
        card.className = 'complaint-card';
        card.innerHTML = `
            <div class="complaint-header">
                <h3>${complaint.subject}</h3>
                <span class="status-badge ${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span>
            </div>
            <div class="complaint-details">
                <p><strong>ID:</strong> ${complaint.id}</p>
                <p><strong>Student:</strong> ${complaint.studentName || 'Unknown'}</p>
                <p><strong>Category:</strong> ${complaint.category}</p>
                <p><strong>Date:</strong> ${complaint.date}</p>
                <p><strong>Description:</strong> ${complaint.description}</p>
            </div>
            <div class="complaint-actions">
                <select id="status-${complaint.id}" class="status-select">
                    <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                </select>
                <button onclick="updateComplaintStatus(${complaint.id})" class="update-btn">
                    Update Status
                </button>
                <button onclick="deleteComplaint(${complaint.id})" class="delete-btn">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        complaintsList.appendChild(card);
    });
}

// Update complaint status
function updateComplaintStatus(complaintId) {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    const statusSelect = document.getElementById(`status-${complaintId}`);
    const newStatus = statusSelect.value;
    
    const complaintIndex = complaints.findIndex(c => c.id === complaintId);
    if (complaintIndex !== -1) {
        complaints[complaintIndex].status = newStatus;
        localStorage.setItem('complaints', JSON.stringify(complaints));
        alert('Complaint status updated successfully!');
        loadAllComplaints();
    }
}

// Delete complaint
function deleteComplaint(complaintId) {
    if (confirm('Are you sure you want to delete this complaint?')) {
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const updatedComplaints = complaints.filter(c => c.id !== complaintId);
        localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
        loadAllComplaints();
    }
}

// Load all suggestions for admin
function loadAllSuggestions() {
    const suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    const suggestionsList = document.getElementById('allSuggestionsList');
    suggestionsList.innerHTML = '';
    
    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<p>No suggestions found.</p>';
        return;
    }
    
    // Sort by votes (highest first)
    suggestions.sort((a, b) => b.votes - a.votes);
    
    suggestions.forEach(suggestion => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.innerHTML = `
            <h4>${suggestion.title}</h4>
            <div class="suggestion-meta">
                <span>Area: ${suggestion.area}</span> | 
                <span>By: ${suggestion.studentName}</span> | 
                <span>Date: ${suggestion.date}</span> |
                <span>Votes: ${suggestion.votes}</span>
            </div>
            <p><strong>Details:</strong> ${suggestion.details}</p>
            <p><strong>Benefits:</strong> ${suggestion.benefits}</p>
            <div class="suggestion-actions">
                <button onclick="deleteSuggestion(${suggestion.id})" class="delete-btn">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        suggestionsList.appendChild(card);
    });
}

// Delete suggestion
function deleteSuggestion(suggestionId) {
    if (confirm('Are you sure you want to delete this suggestion?')) {
        const suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
        const updatedSuggestions = suggestions.filter(s => s.id !== suggestionId);
        localStorage.setItem('suggestions', JSON.stringify(updatedSuggestions));
        loadAllSuggestions();
    }
}

// Load all users for admin
function loadAllUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    if (users.length === 0) {
        usersList.innerHTML = '<tr><td colspan="4">No users found.</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.studentId}</td>
            <td class="user-actions">
                <button onclick="viewUser('${user.email}')" class="view-btn">
                    <i class="fas fa-eye"></i> View
                </button>
                <button onclick="editUser('${user.email}')" class="edit-btn">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteUser('${user.email}')" class="delete-btn">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        usersList.appendChild(row);
    });
}

// View user details
function viewUser(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    
    if (user) {
        alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nStudent ID: ${user.studentId}`);
    }
}

// Edit user
function editUser(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
        const newName = prompt('Enter new name:', users[userIndex].name);
        if (newName !== null) {
            users[userIndex].name = newName;
            localStorage.setItem('users', JSON.stringify(users));
            loadAllUsers();
        }
    }
}

// Delete user
function deleteUser(email) {
    if (confirm('Are you sure you want to delete this user?')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.filter(u => u.email !== email);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        loadAllUsers();
    }
}

// Filter complaints
function filterComplaints() {
    const filterValue = document.getElementById('complaintFilter').value;
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    
    if (filterValue === 'all') {
        loadAllComplaints();
    } else {
        const filteredComplaints = complaints.filter(c => c.status.toLowerCase().replace(' ', '-') === filterValue);
        const complaintsList = document.getElementById('allComplaintsList');
        complaintsList.innerHTML = '';
        
        if (filteredComplaints.length === 0) {
            complaintsList.innerHTML = '<p>No complaints found with this status.</p>';
            return;
        }
        
        filteredComplaints.forEach(complaint => {
            const card = document.createElement('div');
            card.className = 'complaint-card';
            card.innerHTML = `
                <div class="complaint-header">
                    <h3>${complaint.subject}</h3>
                    <span class="status-badge ${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span>
                </div>
                <div class="complaint-details">
                    <p><strong>ID:</strong> ${complaint.id}</p>
                    <p><strong>Student:</strong> ${complaint.studentName || 'Unknown'}</p>
                    <p><strong>Category:</strong> ${complaint.category}</p>
                    <p><strong>Date:</strong> ${complaint.date}</p>
                    <p><strong>Description:</strong> ${complaint.description}</p>
                </div>
                <div class="complaint-actions">
                    <select id="status-${complaint.id}" class="status-select">
                        <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                    <button onclick="updateComplaintStatus(${complaint.id})" class="update-btn">
                        Update Status
                    </button>
                    <button onclick="deleteComplaint(${complaint.id})" class="delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            complaintsList.appendChild(card);
        });
    }
}

// Search users
function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm) ||
        user.studentId.toLowerCase().includes(searchTerm)
    );
    
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    if (filteredUsers.length === 0) {
        usersList.innerHTML = '<tr><td colspan="4">No matching users found.</td></tr>';
        return;
    }
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.studentId}</td>
            <td class="user-actions">
                <button onclick="viewUser('${user.email}')" class="view-btn">
                    <i class="fas fa-eye"></i> View
                </button>
                <button onclick="editUser('${user.email}')" class="edit-btn">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteUser('${user.email}')" class="delete-btn">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        usersList.appendChild(row);
    });
}

// Handle admin settings form submission
document.getElementById('adminSettingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newEmail = document.getElementById('adminEmailSetting').value;
    const newPassword = document.getElementById('adminPasswordSetting').value;
    const confirmPassword = document.getElementById('adminPasswordConfirm').value;
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const admins = JSON.parse(localStorage.getItem('adminUsers')) || [];
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    const adminIndex = admins.findIndex(a => a.email === currentAdmin.email);
    
    if (adminIndex !== -1) {
        admins[adminIndex].email = newEmail;
        if (newPassword) {
            admins[adminIndex].password = newPassword;
        }
        localStorage.setItem('adminUsers', JSON.stringify(admins));
        
        // Update current admin in localStorage
        currentAdmin.email = newEmail;
        localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
        
        // Update displayed name
        document.getElementById('adminName').textContent = currentAdmin.name;
        
        alert('Settings updated successfully!');
    }
});
// At the end of admin-script.js, add:
document.addEventListener('DOMContentLoaded', function() {
    // Load current admin name
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (currentAdmin) {
        document.getElementById('adminName').textContent = currentAdmin.name;
        // Pre-fill email in settings
        document.getElementById('adminEmailSetting').value = currentAdmin.email;
    }
    
    // Show dashboard by default
    showAdminSection('dashboard');
});