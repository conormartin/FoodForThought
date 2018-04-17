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
  var userId = firebase.auth().currentUser.uid;
  
  var database = firebase.database().ref().child('users/' + userId + '/AccountInfo');
  database.once('value', function(snapshot){
    if(snapshot.exists()){
        var content = '';
        snapshot.forEach(function(data){
  // Update the HTML to display the text
          var val= data.val();
          content +='<tr>';
          content += '<td>' + val.Firstname + '</td>';
          content += '<td>' + val.Surname + '</td>';
          content += '<td>' + val.dob + '</td>';
          content += '<td>' + val.email + '</td>';
          content += '<td>' + val.height + '</td>';
          content += '<td>' + val.weight + '</td>';
          content += '</tr>';
        });
        $('#ex-table').append(content);
      }
});