document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userIdInput = document.getElementById('userId'); // Hidden field for editing
    const userList = document.getElementById('userList');
    const displayUserListButton = document.getElementById('displayUserList');
    const userModalElement = document.getElementById('userModal');
    const userModal = new bootstrap.Modal(userModalElement);
    const saveChangesButton = document.getElementById('saveChanges'); // Save button for edits
    const submitButton = document.getElementById('submitButton'); // Register button

    // API Base URL
    const API_URL = 'https://care-connect-server.onrender.com/users';

    // Fetch all users and display them in the table
    async function fetchUsers() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch users');
            return await response.json();
        } catch (error) {
            console.error(error);
            alert('Error fetching users. Please try again.');
            return [];
        }
    }

    // Populate the modal table with user data
    async function displayUsersInModal() {
        const users = await fetchUsers();
        userList.innerHTML = '';  // Clear the table

        if (users.length === 0) {
            userList.innerHTML = `<tr><td colspan="10" class="text-center">No users found</td></tr>`;
        } else {
            users.forEach(user => {
                const row = document.createElement('tr');
                row.dataset.userId = user.id;
                row.innerHTML = `
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.idNumber}</td>
                    <td>${user.countryOfBirth}</td>
                    <td>${user.countyOfBirth}</td>
                    <td>${user.disabilityType}</td>
                    <td><a href="${user.coordinates}" target="_blank">View</a></td>
                    <td><a href="${user.photoLink}" target="_blank">Photo</a></td>
                    <td>${user.comments}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-btn">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                    </td>
                `;
                userList.appendChild(row);
            });
        }

        userModal.show();  // Show the modal with the user list
    }

    // Populate the form with user data for editing
    async function editUser(userId) {
        try {
            const response = await fetch(`${API_URL}/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user details');
            const user = await response.json();

            // Populate form fields with user data
            document.getElementById('firstName').value = user.firstName;
            document.getElementById('lastName').value = user.lastName;
            document.getElementById('idNumber').value = user.idNumber;
            document.getElementById('countryOfBirth').value = user.countryOfBirth;
            document.getElementById('countyOfBirth').value = user.countyOfBirth;
            document.getElementById('disabilityType').value = user.disabilityType;
            document.getElementById('coordinates').value = user.coordinates;
            document.getElementById('photoLink').value = user.photoLink;
            document.getElementById('comments').value = user.comments;
            userIdInput.value = user.id;  // Store the user ID for PATCH

            saveChangesButton.style.display = 'block';  // Show Save button
            submitButton.style.display = 'none';  // Hide Register button
            userModal.hide();  // Close the modal
        } catch (error) {
            console.error(error);
            alert('Error loading user details. Please try again.');
        }
    }

    // Delete a user
    async function deleteUser(userId) {
        try {
            const response = await fetch(`${API_URL}/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('User deleted successfully!');
                displayUsersInModal();  // Refresh the user list
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting user. Please try again.');
        }
    }

    // Create a new user
    async function saveUser(userData) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert('User registered successfully!');
                displayUsersInModal();  // Refresh the user list
            } else {
                throw new Error('Failed to register user');
            }
        } catch (error) {
            console.error(error);
            alert('Error registering user. Please try again.');
        }
    }

    // Update an existing user
    async function updateUser(userId, userData) {
        try {
            const response = await fetch(`${API_URL}/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert('User updated successfully!');
                displayUsersInModal();  // Refresh the user list
            } else {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating user. Please try again.');
        }
    }

    // Handle form submission for both adding and updating users
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
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

        if (userIdInput.value) {
            // Update existing user
            await updateUser(userIdInput.value, userData);
            saveChangesButton.style.display = 'none';  // Hide Save button
            submitButton.style.display = 'block';  // Show Register button
        } else {
            // Create new user
            await saveUser(userData);
        }

        userForm.reset();  // Reset the form
        userIdInput.value = '';  // Clear hidden userId field
    });

    // Handle dynamic button clicks for edit and delete
    userList.addEventListener('click', (event) => {
        const target = event.target;
        const userId = target.closest('tr').dataset.userId;

        if (target.classList.contains('edit-btn')) {
            editUser(userId);
        } else if (target.classList.contains('delete-btn')) {
            deleteUser(userId);
        }
    });

    // Show the modal with the user list when the button is clicked
    displayUserListButton.addEventListener('click', displayUsersInModal);
});
