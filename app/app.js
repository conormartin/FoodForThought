var express = require('express');
var request = require("request");
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", function(req, res){
    res.render("home");
});

// Runs this function when user clicks on SearchResults page
app.post("/search", function(req, res) {
    var searchTerm = req.body.searchTerm;

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
        for(var i=0; i<body.hints[0].measures.length; i++){
            measurement.push(body.hints[0].measures[i]);
        }
        res.render("searchResults", {result: foodType, measures: measurement});
    }
    );
});

// Runs this function when user clicks on Nutrients page
app.get("/Nutrients/", function(req, res) {
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
        var nutrients = body.totalNutrients;

        // from stackoverflow...??? splits json to only show text
        var x = [];
        var allPropertyNames = Object.keys(nutrients);
        for (var j=0; j<allPropertyNames.length; j++) {
            var name = allPropertyNames[j];
            var value = nutrients[name];
            x[j] = value.label + ": " + value.quantity + value.unit;
        }
        res.render("nutrients", {nutrients:x});
    })
});

app.get("/blogPage", function(req, res) {
    res.render("blogPage");
});

// Reroutes all other requests to a default error message
app.get("*", function(req, res) {
    res.send("Page Does Not Exist!");
});

// Activates server on port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'))