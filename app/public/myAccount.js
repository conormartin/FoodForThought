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
    // Get the single most recent from the database and
// update the table with its values. This is called every time the child_added
// event is triggered on the Firebase reference, which means
// that this will update EVEN IF you don't refresh the page. Magic.
firebase.database().ref.limitToLast(1).on('child_added', function(childSnapshot) {
  // Get the  data from the most recent snapshot of data
  // added to the list in Firebase
  users = childSnapshot.val();

  // Update the HTML to display the text
  $("#Firstname").html(users.Firstname)
  $("#Surname").html(users.Surname)
  $("#email").html(users.email)
  $("#DOB").html(users.dob)
  $("#Height").html(users.height)
  $("#Weight").html(users.weight)

});