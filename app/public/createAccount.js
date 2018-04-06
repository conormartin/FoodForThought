// Initialize Firebase 
    
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAkKX9E1tE8RBqkA26a6ZqifnfqYZgl9rE",
    authDomain: "fir-web-login-4c7f6.firebaseapp.com",
    databaseURL: "https://fir-web-login-4c7f6.firebaseio.com",
    projectId: "fir-web-login-4c7f6",
    storageBucket: "fir-web-login-4c7f6.appspot.com",
    messagingSenderId: "265197082111"
  };
  firebase.initializeApp(config);

// Reference messages collection
var accountsRef = firebase.database().ref('Account Info');

// Listen for form submit
document.getElementById('CreateAccount').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
  e.preventDefault();

  // Get values
  var Firstname = getInputVal('Firstname');
  var Surname = getInputVal('Surname');
  var email = getInputVal('email');
  var dob = getInputVal('dob');
  var height = getInputVal('height');
  var weight = getInputVal('weight');


  // Save message
  saveMessage(Firstname, Surname, email, dob, height, weight);

  // Show alert
  document.querySelector('.alert').style.display = 'block';

  // Hide alert after 3 seconds
  setTimeout(function(){
    document.querySelector('.alert').style.display = 'none';
  },5000);

  // Clear form
  document.getElementById('CreateAccount').reset();
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(Firstname, Surname, email, dob, height, weight){
  var newAccountsRef  = accountsRef .push();
  newAccountsRef .set({
    Firstname: Firstname,
    Surname: Surname,
    email:email,
    dob: dob,
    height: height,
    weight: weight
  });



  // Get the single most recent from the database and
// update the table with its values. This is called every time the child_added
// event is triggered on the Firebase reference, which means
// that this will update EVEN IF you don't refresh the page. Magic.
accountsRef.limitToLast(1).on('child_added', function(childSnapshot) {
  // Get the  data from the most recent snapshot of data
  // added to the list in Firebase
  accountInfo = childSnapshot.val();

  // Update the HTML to display the text
  $("#Firstname").html(accountInfo.Firstname)
  $("#Surname").html(accountInfo.Surname)
  $("#email").html(accountInfo.email)
  $("#DOB").html(accountInfo.dob)
  $("#Height").html(accountInfo.height)
  $("#Weight").html(accountInfo.weight)

});


}