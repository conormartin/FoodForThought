
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

  
    var user = firebase.auth().currentUser;
  alert(user.email);
    if(user != null){
      window.alert(user.uid);

      var email_id = user.email;
    }

    document.getElementById("AccountLink").style.display = "block";

    document.getElementById("login_div").style.display = "none";


  } else {
    // No user is signed in.


    document.getElementById("AccountLink").style.display = "none";


    document.getElementById("login_div").style.display = "block";

  }
});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function(firebaseUser){
  var user= firebase.auth().currentUser;
    //window.alert(user.uid);
  })
    // Handle Errors here.
    .catch(function(error) {
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
  alert("Error");
  // An error happened.
});
document.getElementById("AccountLink").style.display = "none";
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
