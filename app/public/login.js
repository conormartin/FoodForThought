firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.




    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;


    }

  } else {
    // No user is signed in.




    document.getElementById("login_div").style.display = "block";

  }
});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function logout(){

firebase.auth().signOut().then(function() {
  // Sign-out successful.
    window.alert("logged out successfully");

}).catch(function(error) {
  // An error happened.
});
}

function reset_password(){

var userEmail = document.getElementById("email_field").value;
    var auth = firebase.auth();
    var emailAddress = userEmail;

    auth.sendPasswordResetEmail(userEmail).then(function() {
        // Email sent.
        window.alert("Reset Email Sent");
    }).catch(function(error) {
        // An error happened.
        window.alert("Error : ")
    });

}
