var config = {
    apiKey: "AIzaSyAkKX9E1tE8RBqkA26a6ZqifnfqYZgl9rE",
    authDomain: "fir-web-login-4c7f6.firebaseapp.com",
    databaseURL: "https://fir-web-login-4c7f6.firebaseio.com",
    projectId: "fir-web-login-4c7f6",
    storageBucket: "fir-web-login-4c7f6.appspot.com",
    messagingSenderId: "265197082111"
};

firebase.initializeApp(config);

function getUserId(){ 
    setTimeout(function(){ 
        var userId = firebase.auth().currentUser.uid;
        console.log(userId);
        $("#userId").val(userId);
        $("#userId2").val(userId);
        $("#analyseBtn").prop("href", "/dietbreakdown/"+userId);
        $("#diary").prop("href", "/foodlog/"+userId);
        console.log($("#diary").prop("href"));
        $("#diary2").prop("href", "/foodlog/"+userId);
    }, 1000); 
}