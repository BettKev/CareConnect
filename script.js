const API_URL = 'https://care-connect-server.onrender.com/users';

// Helper: Extract user data from form fields
function getUserDataFromForm() {
    return {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        idNumber: document.getElementById('idNumber').value,
        countryOfBirth: document.getElementById('countryOfBirth').value,
        countyOfBirth: document.getElementById('countyOfBirth').value,
        disabilityType: document.getElementById('disabilityType').value,
        coordinates: document.getElementById('coordinates').value,
        photoLink: document.getElementById('photoLink').value,
        comments: document.getElementById('comments').value,
    };
}

// Handle form submission: Register or Update user
document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const userId = document.getElementById('userId').value;
    const userData = getUserDataFromForm();

    try {
        let response;
        if (userId) {
            // PATCH request to update user
            response = await fetch(`${API_URL}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            alert('User updated successfully!');
        } else {
            // POST request to register new user
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            alert('User registered successfully!');
        }

        if (!response.ok) throw new Error('Network response was not ok');
        resetForm(); // Clear form after successful operation
        refreshUserList(); // Refresh user list in the modal
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save user. Please try again.');
    }
});

// Display user list in the modal
document.getElementById('displayUserList').addEventListener('click', async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');

        const users = await response.json();
        populateUserList(users);

        const userModal = new bootstrap.Modal(document.getElementById('userModal'));
        userModal.show();
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please try again.');
    }
});

// Populate user list in the modal
function populateUserList(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // Clear the list

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.idNumber}</td>
            <td>${user.countryOfBirth}</td>
            <td>${user.countyOfBirth}</td>
            <td>${user.disabilityType}</td>
            <td>${user.coordinates}</td>
            <td><a href="${user.photoLink}" target="_blank">View</a></td>
            <td>${user.comments}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userList.appendChild(row);
    });
}

// Edit user: Populate form with user data for editing
function editUser(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('firstName').value = user.firstName;
            document.getElementById('lastName').value = user.lastName;
            document.getElementById('idNumber').value = user.idNumber;
            document.getElementById('countryOfBirth').value = user.countryOfBirth;
            document.getElementById('countyOfBirth').value = user.countyOfBirth;
            document.getElementById('disabilityType').value = user.disabilityType;
            document.getElementById('coordinates').value = user.coordinates;
            document.getElementById('photoLink').value = user.photoLink;
            document.getElementById('comments').value = user.comments;
            document.getElementById('userId').value = id;

            document.getElementById('saveChanges').style.display = 'block';
            document.getElementById('submitButton').style.display = 'none';
        })
        .catch(error => console.error('Error loading user data:', error));
}

// Save Changes: Send PATCH request
document.getElementById('saveChanges').addEventListener('click', async () => {
    const userId = document.getElementById('userId').value;
    const updatedUserData = getUserDataFromForm();

    try {
        const response = await fetch(`${API_URL}/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        alert('User updated successfully!');
        resetForm(); // Reset form after update
        refreshUserList(); // Refresh user list in the modal
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
    }
});

// Delete user
async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Network response was not ok');

            alert('User deleted successfully!');
            refreshUserList(); // Refresh user list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        }
    }
}

// Helper: Reset form fields and UI state
function resetForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('saveChanges').style.display = 'none';
    document.getElementById('submitButton').style.display = 'block';
}

// Refresh user list
function refreshUserList() {
    document.getElementById('displayUserList').click(); // Trigger user list reload
}
