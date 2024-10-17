const userRegistrationForm = document.querySelector('form#userForm');

// Register user form submission logic
userRegistrationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const idNumber = document.getElementById('idNumber').value;
  const countryOfBirth = document.getElementById('countryOfBirth').value;
  const countyOfBirth = document.getElementById('countyOfBirth').value;
  const disabilityType = document.getElementById('disabilityType').value;
  const coordinates = document.getElementById('coordinates').value;
  const photoLink = document.getElementById('photoLink').value;
  const comments = document.getElementById('comments').value;

  const api_Url = `https://care-connect-server.onrender.com/users`;

  fetch(api_Url, {
    method: 'POST',
    body: JSON.stringify({
      firstName,
      lastName,
      idNumber,
      countryOfBirth,
      countyOfBirth,
      disabilityType,
      coordinates,
      photoLink,
      comments,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then(() => {
      alert("Registration Successful");
      userRegistrationForm.reset(); // Reset the form after submission
      fetchUsers(); // Refresh user list
    })
    .catch((error) => console.error("Error:", error));
});

// Fetch users and display them
function fetchUsers() {
  const userList = document.getElementById('userList');
  fetch(`https://care-connect-server.onrender.com/users`)
    .then((response) => response.json())
    .then((data) => {
      userList.innerHTML = ''; // Clear previous list
      data.forEach((user) => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `
          <p>${user.firstName} ${user.lastName} - ID: ${user.idNumber}</p>
          <button onclick="openModal(${user.id})">Update</button>
        `;
        userList.appendChild(userDiv);
      });
    })
    .catch((error) => console.error('Error fetching users:', error));
}

// Modal handling logic
const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];

// Open the modal when the button is clicked
btn.onclick = () => {
  modal.style.display = "block";
};

// Close the modal when the user clicks the close button
span.onclick = () => {
  modal.style.display = "none";
};

// Close the modal when the user clicks outside the modal
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
// Open modal and populate form with user details
function openModal(userId) {
  const modal = document.getElementById('myModal');
  fetch(`https://care-connect-server.onrender.com/users/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('userId').value = data.id;
      document.getElementById('firstName').value = data.firstName;
      document.getElementById('lastName').value = data.lastName;
      document.getElementById('idNumber').value = data.idNumber;
      document.getElementById('countryOfBirth').value = data.countryOfBirth;
      document.getElementById('countyOfBirth').value = data.countyOfBirth;
      document.getElementById('disabilityType').value = data.disabilityType;
      document.getElementById('coordinates').value = data.coordinates;
      document.getElementById('photoLink').value = data.photoLink;
      document.getElementById('comments').value = data.comments;
      consssssole.log('')
      modal.style.display = 'block';
    })
    .catch((error) => console.error('Error fetching user details:', error));
}

// Update user information
const updateForm = document.getElementById('updateForm');
updateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const userId = document.getElementById('userId').value;

  fetch(`https://care-connect-server.onrender.com/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      idNumber: document.getElementById('idNumber').value,
      countryOfBirth: document.getElementById('countryOfBirth').value,
      countyOfBirth: document.getElementById('countyOfBirth').value,
      disabilityType: document.getElementById('disabilityType').value,
      coordinates: document.getElementById('coordinates').value,
      photoLink: document.getElementById('photoLink').value,
      comments: document.getElementById('comments').value,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      alert('User successfully updated!');
      fetchUsers(); // Refresh the user list
      modal.style.display = 'none';
    })
    .catch((error) => {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    });
});

// Initial fetch of users
fetchUsers();
