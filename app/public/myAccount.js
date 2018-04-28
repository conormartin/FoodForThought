
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
 // var currentUser=firebase.auth().currentUser;
  var userid;
    
    firebase.auth().onAuthStateChanged(function(user)
    {
      //console.log(firebase.auth());
      //if(user){

      var currentUser= firebase.auth().currentUser;
      

     userid = currentUser.uid; // user hols the reference to currentUser variable.
    
    
    var database = firebase.database().ref().child('users').child(userid).child('AccountInfo');

     database.once('value', function(snapshot){
       if(snapshot.exists()){
           snapshot.forEach(function(data){
     // Update the HTML to display the text in table
             var val= data.val();
           //  console.log(val);
             $('#row1').append('<td contenteditable>'+val+'</td>');

           });

          
         }
   });
   
   document.getElementById("tableButton").addEventListener('click',updateData);

   function updateData(){
    var table = document.getElementById("ex-table"); 
    console.log(table.rows[1].cells[0].innerHTML);           
     var tFirstname= table.rows[1].cells[0].innerHTML;
     var tSurname= table.rows[1].cells[1].innerHTML;
     var tEmail= table.rows[1].cells[2].innerHTML;
     curentUser.email=tEmail;//update their login email
     var tDob= table.rows[1].cells[3].innerHTML;
     var tHeight= table.rows[1].cells[4].innerHTML;
     var tWeight= table.rows[1].cells[5].innerHTML;

     database.update({
      Firstname:tFirstname,
      Surname: tSurname,
      email:tEmail,
      dob: tDob,
      height: tHeight ,
      weight: tWeight
     });
   }
  
 
  });
  
}