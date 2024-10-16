// This section handles the user registration form it takes tttthe values entered in the form and passes them to the server
const userRegistrationForm = document.querySelector('form#userForm');
userRegistrationForm.addEventListener("submit", (event)=>{
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

  fetch('http://localhost:3000/users', {
    method: 'POST',
  body: JSON.stringify({
    firstName: firstName,
    lastName: lastName,
    idNumber: idNumber,
    countryOfBirth: countryOfBirth,
    countyOfBirth: countyOfBirth,
    disabilityType: disabilityType,
    coordinates: coordinates,
    photoLink: photoLink,
    comments: comments

  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
  })
  .then((response) => response.json())
        .then((res) => {
          // const message = document.getElementById("message");
          // message.innerText = "User Successfully registered";
          alert("Registration Successfull")
        });   
})


//Modal functionality section
const userList = document.getElementById('userList');
const modal = document.getElementById('updateModal');
const closeModal = document.querySelector('.close');
const updateForm = document.getElementById('updateForm');

// Fetch users and display them
function fetchUsers() {
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(data => {
            userList.innerHTML = '';
            data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.innerHTML = `
                    <p>${user.name} - ${user.email}</p>
                    <button onclick="openModal(${user.id}, '${user.name}', '${user.email}')">Update</button>
                `;
                userList.appendChild(userDiv);
            });
        });
}

// Open modal and populate form
function openModal(userId, firstName, lastName) {
  fetch(`http://localhost:3000/users/${userId}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('userId').value = userId;
      document.getElementById('firstName').value = firstName;
      document.getElementById('lastName').value = lastName;
      document.getElementById('idNumber').value = data.idNumber;
      document.getElementById('countryOfBirth').value = data.countryOfBirth;
      document.getElementById('countyOfBirth').value = data.countyOfBirth;
      document.getElementById('disabilityType').value = data.disabilityType;
      document.getElementById('coordinates').value = data.coordinates;
      document.getElementById('photoLink').value = data.photoLink;
      document.getElementById('comments').value = data.comments;
      modal.style.display = 'block';
    });
}
// Close modal
closeModal.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Update user information
updateForm.onsubmit = function(event) {
  event.preventDefault();
  const userId = document.getElementById('userId').value;
  
  fetch(`http://localhost:3000/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName: document.querySelector(`input[name="firstName"]`).value,
      lastName: document.querySelector(`input[name="lastName"]`).value,
      idNumber: document.querySelector(`input[name="idNumber"]`).value,
      countryOfBirth: document.querySelector(`input[name="countryOfBirth"]`).value,
      countyOfBirth: document.querySelector(`input[name="countyOfBirth"]`).value,
      disabilityType: document.querySelector(`input[name="disabilityType"]`).value,
      coordinates: document.querySelector(`input[name="coordinates"]`).value,
      photoLink: document.querySelector(`input[name="photoLink"]`).value,
      comments: document.querySelector(`textarea[name="comments"]`).value
    })
  })
  .then(response => response.json())
  .then(data => {
    fetchUsers();
    modal.style.display = 'none';
    document.getElementById('message').innerText = 'User successfully updated!';
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('message').innerText = 'Failed to update user. Please try again.';
  });
}

// Initial fetch of users
fetchUsers();
