var config = {
apiKey: "AIzaSyAkKX9E1tE8RBqkA26a6ZqifnfqYZgl9rE",
authDomain: "fir-web-login-4c7f6.firebaseapp.com",
databaseURL: "https://fir-web-login-4c7f6.firebaseio.com",
projectId: "fir-web-login-4c7f6",
storageBucket: "fir-web-login-4c7f6.appspot.com",
messagingSenderId: "265197082111"
};
firebase.initializeApp(config);

function checkUser(){
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("acc").style.display = "block";


  } else {
    // No user is signed in.


    document.getElementById("acc").style.display = "none";

  }
});
}
function logout(){

firebase.auth().signOut().then(function() {
  // Sign-out successful.
    window.alert("logged out successfully");
    window.location.href = "/";
},(function(error) {
  // An error happened.
  alert("error");
}))

}
