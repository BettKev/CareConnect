document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('userForm');
  const userIdInput = document.getElementById('userId');
  const userList = document.getElementById('userList');
  const displayUserListButton = document.getElementById('displayUserList');
  const userModal = document.getElementById('userModal');
  const closeModalButton = document.querySelector('.close');
  const saveChangesButton = document.getElementById('saveChanges');

  // Function to fetch users from the API
  async function fetchUsers() {
      const response = await fetch('https://care-connect-server.onrender.com/users');
      const users = await response.json();
      return users;
  }

  // Function to display users in the modal
  async function displayUsersInModal() {
      const users = await fetchUsers();
      userList.innerHTML = ''; // Clear previous entries
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
              <td><a href="${user.photoLink}" target="_blank">View Photo</a></td>
              <td>${user.comments}</td>
              <td class="actions">
                  <button onclick="editUser(${user.id})">Edit</button>
                  <button onclick="deleteUser(${user.id})">Delete</button>
              </td>
          `;
          userList.appendChild(row);
      });
  }

  // Function to save user to the API
  async function saveUser(userData) {
      const response = await fetch('https://care-connect-server.onrender.com/users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
      });

      if (response.ok) {
          alert("User registered successfully!");
          await updateUserList();
      } else {
          alert("Error registering user!");
      }
  }

  // Function to update user
  async function updateUser(id, userData) {
      const response = await fetch(`https://care-connect-server.onrender.com/users/${id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
      });

      if (response.ok) {
          alert("User updated successfully!");
          await updateUserList(); // Refresh the user list after update
      } else {
          alert("Error updating user!");
      }
  }

  // Function to handle form submission
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

      // Check if editing a user
      if (userIdInput.value) {
          await updateUser(userIdInput.value, userData);
      } else {
          // Save user via API
          await saveUser(userData);
      }

      userForm.reset();
      userIdInput.value = ''; // Clear the user ID
      saveChangesButton.style.display = 'none'; // Hide the save changes button
  });

  displayUserListButton.addEventListener('click', () => {
      displayUsersInModal();
      userModal.style.display = 'block';
  });

  closeModalButton.addEventListener('click', () => {
      userModal.style.display = 'none';
  });

  window.onclick = (event) => {
      if (event.target === userModal) {
          userModal.style.display = 'none';
      }
  };

  // Update the displayed user list in the main view
  async function updateUserList() {
      const users = await fetchUsers();
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
              <td><a href="${user.photoLink}" target="_blank">View Photo</a></td>
              <td>${user.comments}</td>
              <td class="actions">
                  <button onclick="editUser(${user.id})">Edit</button>
                  <button onclick="deleteUser(${user.id})">Delete</button>
              </td>
          `;
          userList.appendChild(row);
      });
  }

  // Fetch the initial user list
  updateUserList();
});

// Function to edit a user
async function editUser(id) {
  const response = await fetch(`https://care-connect-server.onrender.com/users/${id}`);
  const user = await response.json();

  // Fill the form with user data
  document.getElementById('userId').value = user.id;
  document.getElementById('firstName').value = user.firstName;
  document.getElementById('lastName').value = user.lastName;
  document.getElementById('idNumber').value = user.idNumber;
  document.getElementById('countryOfBirth').value = user.countryOfBirth;
  document.getElementById('countyOfBirth').value = user.countyOfBirth;
  document.getElementById('disabilityType').value = user.disabilityType;
  document.getElementById('coordinates').value = user.coordinates;
  document.getElementById('photoLink').value = user.photoLink;
  document.getElementById('comments').value = user.comments;

  // Show the save changes button
  document.getElementById('saveChanges').style.display = 'inline-block';

  // Close modal
  document.getElementById('userModal').style.display = 'none';
}

// Function to delete a user
async function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
      const response = await fetch(`https://care-connect-server.onrender.com/users/${id}`, {
          method: 'DELETE',
      });

      if (response.ok) {
          alert("User deleted successfully!");
          updateUserList(); // Refresh the user list
      } else {
          alert("Error deleting user!");
      }
  }
}
