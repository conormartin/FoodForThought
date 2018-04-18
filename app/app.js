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



//default homepage route
app.get("/", function(req, res){
    res.render("home");
});

//render login, signup & account page
app.get("/login", function(req,res) {
    res.render("login");
});

app.get("/signup", function(req,res) {
    res.render("signup");
});

app.get("/account", function(req,res) {
    res.render("myAccount");
});



// get request to API when user searches for food in navbar
app.get("/search", function(req, res) {
    var searchTerm = req.query.searchTerm;
    request({
        url: 'https://api.edamam.com/api/food-database/parser?ingr='+ searchTerm +'&app_id=2833224e&app_key=e94a0357178f49708c6ae8d70de7fea6',
        method: "GET",
        json: true,
    }, function (error, response, body){
        var foodType = [];
        var measurement = [];
        for(var i=0; i<body.hints.length; i++){
            foodType.push(body.hints[i].food);
        }
        for(var i=0; i<body.hints.length; i++){
            for(var j=0; j<body.hints[i].measures.length; j++) {
                measurement.push(body.hints[i].measures[j]);
            }
        }
        res.render("searchResults", {result: foodType, measures: measurement});
    });
});




// on search results page, user selects which food they want, quantity and measurement, this is sent in json as a post request
// nutrients page displays nutritional breakdown of the selected food
app.get("/nutrients", function(req, res) {
    //json object containing info on food type & quantity
    var quantity = req.query.quantity.replace(/['"]+/g, '');
    var measurement = req.query.measurement.replace(/['"]+/g, '');
    var foodType = req.query.foodType.replace(/['"]+/g, '');

    var foodJson = {
        "yield": 1,
        "ingredients": [{
            "quantity": Number(quantity),
            "measureURI": measurement,
            "foodURI": foodType
        }]
    };
    //post requeat sends foodJson & returns nutritional breakdown
    request({
        url: "https://api.edamam.com/api/food-database/nutrients?app_id=2833224e&app_key=f49370b187bbd05209a7472b217a70d7",
        method: "POST",
        json: true,
        body: foodJson
    }, function (error, response, body){
        //nutrients data
        var nutrients = body.totalNutrients;
        var label = [];
        var quantity = [];
        var allPropertyNames = Object.keys(nutrients);
        for (var j=0; j<allPropertyNames.length; j++) {
            var name = allPropertyNames[j];
            var value = nutrients[name];
            label.push(value.label);
            var quantityUnrounded = value.quantity;
            quantity.push((Math.round(quantityUnrounded * 100) / 100)+value.unit);
        }

        //rda data
        var rda = body.totalDaily;
        var rda2 = [];
        var allPropertyNames2 = Object.keys(rda);
        for (var j=0; j<allPropertyNames2.length; j++) {
            var name = allPropertyNames2[j];
            var value = rda[name];
            var quantityUnrounded = value.quantity;
            rda2.push((Math.round(quantityUnrounded * 100) / 100)+" "+value.unit);
        }
        res.render("nutrients", {label:label, quantity:quantity, rda:rda2});
    })
});





//renders blog page
app.get("/blog", function(req, res) {
    res.render("blog");
});






// arrays to temporarily save food log values until firebase is working
var foodType = [], measurement = [], loggedFood = [], loggedQuantity = [], calories = [], fat = [], protein = [];

//shows basic foodlog page when clicked on navbar
app.get("/foodlog", function(req,res) {
    res.render("foodlog", {foodType:foodType, measures:measurement, loggedFood:loggedFood}); 
})




var calories = [];
//shows foodlog page with search results
app.post("/foodlog", function(req,res) {
    var searchTerm = req.body.searchTerm;
    request({
        url: 'https://api.edamam.com/api/food-database/parser?ingr='+ searchTerm +'&app_id=2833224e&app_key=e94a0357178f49708c6ae8d70de7fea6',
        method: "GET",
        json: true,
    }, function (error, response, body){
        for(var i=0; i<body.hints.length; i++){
            foodType.push(body.hints[i].food);
            calories.push(body.hints[i].food)
        }
        for(var i=0; i<body.hints[0].measures.length; i++){
            measurement.push(body.hints[0].measures[i]);
        }
        res.render("foodlog", {foodType: foodType, measures: measurement, loggedFood:loggedFood});
    });
});





//shows foodlog page with data submitted to log (not finished)
app.get("/foodlog:submitted", function(req,res) {
    var quantity = req.query.quantity.replace(/['"]+/g, '');
    var measure = req.query.measurement.replace(/['"]+/g, '');
    var food = req.query.foodType.replace(/['"]+/g, '');
    var foodUrl = req.query.foodUrl.replace(/['"]+/g, '');
    var measurementUrl = req.query.measurement.replace(/['"]+/g, '');
    
    var foodJson = {
        "yield": 1,
        "ingredients": [{
            "quantity": Number(quantity),
            "measureURI": measurementUrl,
            "foodURI": foodUrl
        }]
    };
    loggedFood.push(food);
    loggedQuantity.push(quantity);
    request({
        url: "https://api.edamam.com/api/food-database/nutrients?app_id=2833224e&app_key=f49370b187bbd05209a7472b217a70d7",
        method: "POST",
        json: true,
        body: foodJson
    }, function (error, response, body){
        var nutrients = body.totalNutrients;
        var quantity = [];
        var cal = body.calories;
        calories.push(cal);
        var unroundedFat = body.totalNutrients.FAT.quantity;
        fat.push(Math.round(unroundedFat * 100) / 100);
        var unroundedProtein = body.totalNutrients.PROCNT.quantity
        protein.push(Math.round(unroundedProtein * 100) / 100);
        res.render("foodlog", {foodType:foodType, measures:measurement, loggedFood:loggedFood, loggedQuantity:loggedQuantity, calories:calories, fat:fat, protein:protein});    
    });
});



//renders diet breakdown table from foodlog page
app.get("/dietbreakdown", function(req, res){
    res.render("dietbreakdown");
});



//shows contact page (empty)
app.get("/contact", function(req, res){
    res.render("ContactForm");
});



//shows about page (empty)
app.get("/about", function(req, res){
    res.render("about");
});




// Reroutes all other requests to a default error message (eg. page does not exist)
app.get("*", function(req, res) {
    res.render("errorPage");
});



// Activates server on port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'));