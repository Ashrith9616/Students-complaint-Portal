// Store users in localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Show/hide forms
function showForm(formType) {
    const forms = ['loginForm', 'registerForm', 'adminLoginForm', 'adminRegisterForm'];
    const navBtns = document.querySelectorAll('.nav-btn');
    
    // Hide all forms and remove active class from buttons
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) form.classList.remove('active');
    });
    navBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show the selected form
    if (formType === 'adminRegister') {
        document.getElementById('adminRegisterForm').classList.add('active');
    } else if (formType === 'adminLogin') {
        document.getElementById('adminLoginForm').classList.add('active');
        document.querySelector(`button[onclick="showForm('adminLogin')"]`).classList.add('active');
    } else {
        document.getElementById(`${formType}Form`).classList.add('active');
        document.querySelector(`button[onclick="showForm('${formType}')"]`).classList.add('active');
    }
}

// Handle student login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password');
    }
});

// Handle student registration form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const studentId = document.getElementById('regStudentId').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (users.some(user => user.email === email)) {
        alert('Email already registered');
        return;
    }

    const newUser = { name, email, studentId, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful!');
    showForm('login');
});

// Initialize admin users if not exists
if (!localStorage.getItem('adminUsers')) {
    const defaultAdmin = {
        email: "admin@college.edu",
        password: "Admin@123",
        name: "System Admin",
        role: "admin"
    };
    localStorage.setItem('adminUsers', JSON.stringify([defaultAdmin]));
}

// Admin login handler
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const admins = JSON.parse(localStorage.getItem('adminUsers')) || [];
    
    const admin = admins.find(a => a.email === email && a.password === password);
    
    if (admin) {
        localStorage.setItem('currentAdmin', JSON.stringify(admin));
        console.log('Admin login successful:', admin);
        window.location.href = 'admin-dashboard.html';
        return true;
    } else {
        console.error('Invalid admin credentials');
        alert('Invalid admin credentials');
        return false;
    }
});

// Admin registration handler
document.getElementById('adminRegisterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('adminRegName').value;
    const email = document.getElementById('adminRegEmail').value;
    const password = document.getElementById('adminRegPassword').value;
    const confirmPassword = document.getElementById('adminRegConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }
    
    const admins = JSON.parse(localStorage.getItem('adminUsers')) || [];
    
    // Check if email already exists
    if (admins.some(a => a.email === email)) {
        alert('Email already registered');
        return;
    }
    
    // Create new admin
    const newAdmin = {
        name: name,
        email: email,
        password: password,
        role: "admin"
    };
    
    admins.push(newAdmin);
    localStorage.setItem('adminUsers', JSON.stringify(admins));
    
    alert('Admin registration successful!');
    showForm('adminLogin');
});

// Initialize forms
document.addEventListener('DOMContentLoaded', function() {
    showForm('login');
});