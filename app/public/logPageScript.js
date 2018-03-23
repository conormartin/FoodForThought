var tableRef = document.getElementById("resultsTable");

//add new row
function addRow() {
  var tableRef = document.getElementById("resultsTable");
  var newRow = tableRef.insertRow(tableRef.rows.length);
  var len = tableRef.rows[0].cells.length;

//insert cell from 0 to len-1 with - in each cell
  for(var i=0;i<len;i++){
    var newCell = newRow.insertCell(i);
    var newText = document.createTextNode('-');


    if(i===len-4 || i===len-5){
      newCell.contentEditable = "false";
      var txtBox = document.createElement("input");
      txtBox.type = "text";
      txtBox.name = "Text1";
      txtBox.id = "myTxt";

      newCell.appendChild(txtBox);
    }
    else {
      newCell.appendChild(newText);
      newCell.contentEditable = "false";
    }
  }
}




// var config = {
//     apiKey: "AIzaSyAkKX9E1tE8RBqkA26a6ZqifnfqYZgl9rE",
//     authDomain: "fir-web-login-4c7f6.firebaseapp.com",
//     databaseURL: "https://fir-web-login-4c7f6.firebaseio.com",
//     projectId: "fir-web-login-4c7f6",
//     storageBucket: "fir-web-login-4c7f6.appspot.com",
//     messagingSenderId: "265197082111"
//   };
//   firebase.initializeApp(config);
//
//   // Reference messages collection
// var accountsRef = firebase.database().ref('foodLog');
//
//
// // Listen for form submit
// document.getElementById('my_form').addEventListener('submit', submitForm);
//
//
// // Submit form
// function submitForm(e){
//   e.preventDefault();
//
//
//   // Get values
//   var tableRef = document.getElementById("resultsTable");
//   var newRow = tableRef.insertRow(tableRef.rows.length);
//   var len = tableRef.rows[0].cells.length;
//
// //insert cell from 0 to len-1 with - in each cell
//   for(var i=0;i<len;i++){
//     var Food = getInputVal('Food');
//     var Amount = getInputVal('amount');
//
//
//     if(i===len-4 || i===len-5){
//     }
//   }
//
//
//   // Save message
//   saveMessage(Food, Amount);
//
//
//   // Function to get get form values
// function getInputVal(id){
//   return document.getElementById(id).value;
// }
//
//
// // Save message to firebase
// function saveMessage(Food, Amount){
//   var newAccountsRef  = accountsRef .push();
//   newAccountsRef .set({
//     Food: Food,
//     Amount: Amount
//   });
