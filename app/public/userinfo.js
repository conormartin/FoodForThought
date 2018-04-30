
// Reference messages collection


// Listen for form submit
document.getElementById("sub1").addEventListener('click', submitForm);

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
    writeUserData(Firstname, Surname, email, dob, height, weight);

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

var database = firebase.database();


// Save message to firebase
function writeUserData(Firstname, Surname, email, dob, height, weight){

    var userId = firebase.auth().currentUser.uid;

    console.log(userId);

   database.ref().child('users/' + userId + '/AccountInfo').set({
        Firstname: Firstname,
        Surname: Surname,
        email:email,
        dob: dob,
        height: height,
        weight: weight
    });
}
