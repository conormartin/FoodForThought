var express = require('express');
var request = require("request");
var bodyParser = require('body-parser');
var app = express();
var firebase = require("firebase");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

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
var database = firebase.database();

function getDate() {
    var dateObj =   new Date(),
    month   =   dateObj.getUTCMonth() + 1,
    day     =   dateObj.getUTCDate(),
    year    =   dateObj.getUTCFullYear(),
    date    =   day + "-" + month + "-" + year;
    return date;
}


app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req,res) {
    res.render("login");
});

app.get("/signup", function(req,res) {
    res.render("signup");
});

app.get("/account", function(req,res) {
    res.render("myAccount");
});

app.get("/blog", function(req, res) {
    res.render("blog");
});

app.get("/contact", function(req, res){
    res.render("ContactForm");
});

app.get("/about", function(req, res){
    res.render("about");
});


// get request to API when user searches for food in navbar
app.get("/search", function(req, res) {
    var searchTerm = req.query.searchTerm;
    request({
        url: 'https://api.edamam.com/api/food-database/parser?ingr='+ searchTerm +'&app_id=2833224e&app_key=e94a0357178f49708c6ae8d70de7fea6',
        method: "GET",
        json: true,
    }, function (error, response, body){
        database.ref().child('food_db/searches/'+searchTerm).set({
            results: body.hints
        });
        var db = database.ref().child('food_db').child('searches').child(searchTerm).child('results');
        db.once('value', function(snapshot){
            if(snapshot.exists()){
                var result = snapshot.val();
                res.render("searchResults", {result: result});
            }
        });
    });
});


// on search results page, user selects which food they want, quantity and measurement, this is sent in json as a post request
// nutrients page displays nutritional breakdown of the selected food
app.get("/nutrients", function(req, res) {
    //json object containing info on food type & quantity
    var quantity        =   req.query.quantity.replace(/['"]+/g, ''),
        foodUrl         =   req.query.foodUrl.replace(/['"]+/g, ''),
        foodName        =   req.query.foodName.replace(/['"]+/g, ''),
        measureVal      =   req.query.measurementUrl.replace(/['"]+/g, ''),
        measureArray    =   measureVal.split(','),
        measurement     =   measureArray[0],    
        measurementUrl  =   measureArray[1];   

    var foodJson = {
        "yield": 1,
        "ingredients": [{
            "quantity": Number(quantity),
            "measureURI": measurementUrl,
            "foodURI": foodUrl
        }]
    };
    // post request sends foodJson & returns nutritional breakdown
    request({
        url: "https://api.edamam.com/api/food-database/nutrients?app_id=2833224e&app_key=f49370b187bbd05209a7472b217a70d7",
        method: "POST",
        json: true,
        body: foodJson
    }, function (error, response, body){
        database.ref().child('food_db/nutrition/'+foodName+'_'+quantity+'_'+measurement).set({
            nutrients: body.totalNutrients,
            rda: body.totalDaily
        });

        var db = database.ref().child('food_db').child('nutrition').child(foodName+'_'+quantity+'_'+measurement);
        db.once('value', function(snapshot){
            if(snapshot.exists()){
                var food = snapshot.val();
                res.render("nutrients", {nutrients: food.nutrients, rda: food.rda});
            }
        });
    })
});


//shows basic foodlog page when clicked on navbar
app.get("/foodlog", function(req,res) {
    var date = getDate();
    var db = database.ref().child('users').child('bhpuc4il4gecxSMd2gnDJv4Buif2').child('diet').child(date);
    db.once('value', function(snapshot){
        if(snapshot.exists()){
            var loggedFood = snapshot.val();
            res.render("foodlog", {loggedFood:loggedFood});
        } else{
            res.render("foodlog");
        }
    });
})


//shows foodlog page with search results
app.post("/foodlog", function(req,res) {
    var searchTerm = req.body.searchTerm;
    var date = getDate();
    
    request({
        url: 'https://api.edamam.com/api/food-database/parser?ingr='+ searchTerm +'&app_id=2833224e&app_key=e94a0357178f49708c6ae8d70de7fea6',
        method: "GET",
        json: true,
    }, function (error, response, body){
        database.ref().child('food_db/searches/'+searchTerm).set({
            results: body.hints
        });
    });
    var loggedFood;
    var db = database.ref().child('users').child('bhpuc4il4gecxSMd2gnDJv4Buif2').child('diet').child(date);
    db.once('value', function(snapshot){
        if(snapshot.exists()){
            loggedFood = snapshot.val();
        }
    });
    var db = database.ref().child('food_db').child('searches').child(searchTerm).child('results');
    db.once('value', function(snapshot){
        if(snapshot.exists()){
            var result = snapshot.val();
            res.render("foodLog", {result:result, loggedFood:loggedFood});
        }
    });
});


//shows foodlog page with data submitted to log (not finished)
app.get("/foodlog:submitted", function(req,res) {
    var quantity        =   req.query.quantity.replace(/['"]+/g, ''),
        foodName        =   req.query.foodName.replace(/['"]+/g, ''),
        foodUrl         =   req.query.foodUrl.replace(/['"]+/g, ''),
        measureVal      =   req.query.measurement.replace(/['"]+/g, ''),
        measureArray    =   measureVal.split(','),
        measurement     =   measureArray[0];
        measurementUrl  =   measureArray[1];        

    var date = getDate();
    
    database.ref().child('users/bhpuc4il4gecxSMd2gnDJv4Buif2/diet/'+date+'/'+foodName+"_"+quantity+'_'+measurement).set({
        foodName : foodName,
        quantity : quantity,
        measurement: measurement,
        foodUrl : foodUrl,
        measurementUrl : measurementUrl
    });

    var foodJson = {
        "yield": 1,
        "ingredients": [{
            "quantity": Number(quantity),
            "measureURI": measurementUrl,
            "foodURI": foodUrl
        }]
    };
    request({
        url: "https://api.edamam.com/api/food-database/nutrients?app_id=2833224e&app_key=f49370b187bbd05209a7472b217a70d7",
        method: "POST",
        json: true,
        body: foodJson
    }, function (error, response, body){
        database.ref().child('food_db/nutrition/'+foodName+'_'+quantity+'_'+measurement).set({
            nutrients: body.totalNutrients,
            rda: body.totalDaily
        });
    });
    var db = database.ref().child('users').child('bhpuc4il4gecxSMd2gnDJv4Buif2').child('diet').child(date);
    db.once('value', function(snapshot){
        if(snapshot.exists()){
            var loggedFood = snapshot.val();
            res.render("foodlog", {loggedFood:loggedFood});
        }
    });
});


app.get("/dietbreakdown", function(req, res){
    var date = getDate();
    var db = database.ref().child('users').child('bhpuc4il4gecxSMd2gnDJv4Buif2').child('diet').child(date);
    db.once('value', function(snapshot){
        if(snapshot.exists()){
            var loggedFood = snapshot.val();
            snapshot.forEach(function(child) {
                console.log(child.key);
            });
        }
    });

    var db = database.ref().child('food_db').child('nutrition');
    db.once('value', function(snapshot){
        if(snapshot.exists()){
            var nutrients;
            snapshot.forEach(function(child) {
                var nutrients = child.val().nutrients;
                var rda = child.val().rda;
                // console.log(rda);
            });
            res.render("dietbreakdown", {nutrients:nutrients});
        }
    });
});

// Reroutes all other requests to a default error message (eg. page does not exist)
app.get("*", function(req, res) {
    res.render("errorPage");
});


// Activates server on port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'));