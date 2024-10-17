const API_URL = 'https://care-connect-server.onrender.com/users';

// Function to handle user registration and updating
document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const userId = document.getElementById('userId').value; // Get the user ID from the hidden field
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

    try {
        let response;
        if (userId) {
            // PATCH existing user
            response = await fetch(`${API_URL}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            alert('User updated successfully!'); // Alert for successful update
        } else {
            // POST new user
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            alert('User registered successfully!'); // Alert for successful registration
        }

        if (!response.ok) {
            throw new Error('Network response was not ok'); // Handle errors from response
        }

        // Reset form and clear user ID
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = ''; 
        document.getElementById('saveChanges').style.display = 'none'; // Hide save changes button
        document.getElementById('submitButton').style.display = 'block'; // Show register user button
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save user. Please try again.'); // Alert for errors
    }
});

// Function to display user list in a modal
document.getElementById('displayUserList').addEventListener('click', async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');

        const users = await response.json();
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear existing users

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

        const userModal = new bootstrap.Modal(document.getElementById('userModal'));
        userModal.show();
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please try again.');
    }
});

// Function to edit user
function editUser(id) {
    const userRow = document.getElementById('userList').children[id - 1]; // Assuming ID starts at 1
    const cells = userRow.children;

    document.getElementById('firstName').value = cells[0].innerText;
    document.getElementById('lastName').value = cells[1].innerText;
    document.getElementById('idNumber').value = cells[2].innerText;
    document.getElementById('countryOfBirth').value = cells[3].innerText;
    document.getElementById('countyOfBirth').value = cells[4].innerText;
    document.getElementById('disabilityType').value = cells[5].innerText;
    document.getElementById('coordinates').value = cells[6].innerText;
    document.getElementById('photoLink').value = cells[7].children[0].href;
    document.getElementById('comments').value = cells[8].innerText;

    document.getElementById('userId').value = id; // Set user ID for PATCH request
    document.getElementById('saveChanges').style.display = 'block'; // Show save changes button
    document.getElementById('submitButton').style.display = 'none'; // Hide register user button

    // Rebind event listener for save changes button
    document.getElementById('saveChanges').onclick = async () => {
        const updatedUserData = {
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

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('User updated successfully!'); // Alert for successful update
            document.getElementById('userForm').reset(); // Reset form
            document.getElementById('userId').value = ''; 
            document.getElementById('saveChanges').style.display = 'none'; // Hide save changes button
            document.getElementById('submitButton').style.display = 'block'; // Show register user button
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again.'); // Alert for errors
        }
    };
}

// Function to delete user
async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Network response was not ok');

            alert('User deleted successfully!');
            document.getElementById('displayUserList').click(); // Refresh user list
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        }
    }
}
