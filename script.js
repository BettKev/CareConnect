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
          const message = document.getElementById("message");
          message.innerText = "User Successfully registered";
          
        });
})
