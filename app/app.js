var express = require('express');
var request = require("request");
var bodyParser = require('body-parser');
var app = express();
var admin = require('firebase-admin');
var serviceAccount = require('./fir-web-login-4c7f6-firebase-adminsdk-tu6mq-5eebf71633.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fir-web-login-4c7f6.firebaseio.com/'
});
var database = admin.database();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

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

app.get("/userinfo", function(req,res) {
    res.render("userinfo");
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

app.get("/verify", function(req, res){
    res.render("verify");
});

// get request to API when user searches for food in navbar
app.get("/search", function(req, res) {
    var searchTerm = req.query.searchTerm;
    var db = database.ref().child('food_db').child('searches');
    db.once('value', function(snapshot) {
        if (snapshot.hasChild(searchTerm)) {
            db = database.ref().child('food_db').child('searches').child(searchTerm).child('results');
            db.once('value', function(snapshot){
                if(snapshot.exists()){
                    console.log("Got results from firebase")
                    var result = snapshot.val();
                    res.render("searchResults", {result: result});
                }
            });
        } else {
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
                        console.log("Got results from api")
                        var result = snapshot.val();
                        res.render("searchResults", {result: result});
                    }
                });
            });
        }
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

    var db = database.ref().child('food_db').child('nutrition');
    db.once('value', function(snapshot) {
        if (snapshot.hasChild(foodName+'_'+quantity+'_'+measurement)) {
            db = database.ref().child('food_db').child('nutrition').child(foodName+'_'+quantity+'_'+measurement);
            db.once('value', function(snapshot){
                if(snapshot.exists()){
                    var food = snapshot.val();
                    console.log("Nutrients from Firebase");
                    res.render("nutrients", {nutrients: food.nutrients, rda: food.rda});
                }
            });
        } else {
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
                        console.log("Nutrients from API");
                        res.render("nutrients", {nutrients: food.nutrients, rda: food.rda});
                    }
                });
            });
        }
    });
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
    var loggedFood;

    var db = database.ref().child('users').child('bhpuc4il4gecxSMd2gnDJv4Buif2').child('diet').child(date);
    db.once('value', function(snapshot){
        if(snapshot.exists()){
            loggedFood = snapshot.val();
        }
    });

    var db = database.ref().child('food_db').child('searches');
    db.once('value', function(snapshot) {
        if (snapshot.hasChild(searchTerm)) {
            console.log("Got results from Firebase")
            var db = database.ref().child('food_db').child('searches').child(searchTerm).child('results');
            db.once('value', function(snapshot){
                if(snapshot.exists()){
                    var result = snapshot.val();
                    res.render("foodLog", {result:result, loggedFood:loggedFood});
                }
            });
        } else {
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
                        console.log("Got results from API")
                        var result = snapshot.val();
                        res.render("foodLog", {result:result, loggedFood:loggedFood});
                    }
                });
            });
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

    var db = database.ref().child('food_db').child('nutrition');
    db.once('value', function(snapshot) {
        if (snapshot.hasChild(foodName+'_'+quantity+'_'+measurement)) {
            console.log("Nutrients already in db")
        } else {
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
                    nutrients : body.totalNutrients,
                    rda : body.totalDaily
                });
                console.log("Got nutrients from API")
            });
        }
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
    var dailyLog = [];
    var nutrientsObject = {};
    var rdaObject = {};

    var db = database.ref().child('users').child('bhpuc4il4gecxSMd2gnDJv4Buif2').child('diet').child(date);
    db.once('value', function(snapshot){
        if(snapshot.exists()){
            var loggedFood = snapshot.val();
            snapshot.forEach(function(child) {
                dailyLog.push(child.key);
            });
        }
        for(var i=0; i<dailyLog.length; i++) {
            var db = database.ref().child('food_db').child('nutrition').child(dailyLog[i]);
            db.once('value', function(snapshot){
                if(snapshot.exists()){
                    var nutrients = snapshot.val().nutrients;
                    var rda = snapshot.val().rda;

                    for (var key in nutrients){
                        if (nutrients.hasOwnProperty(key)) {
                            if(nutrientsObject[nutrients[key].label]){
                                nutrientsObject[nutrients[key].label] += Math.round(nutrients[key].quantity*100)/100;
                            } else {
                                nutrientsObject[nutrients[key].label] = Math.round(nutrients[key].quantity*100)/100;
                            }
                        }
                    }
                    for (var key in rda){
                        if (rda.hasOwnProperty(key)) {
                            if(rdaObject[rda[key].label]){
                                rdaObject[rda[key].label] += Math.round(rda[key].quantity*100)/100;
                            } else {
                                rdaObject[rda[key].label] = Math.round(rda[key].quantity*100)/100;
                            }
                        }
                    }
                    database.ref().child('users').child('bhpuc4il4gecxSMd2gnDJv4Buif2').child('diet').child(date).child('totals').child().set({
                        totalFood : nutrientsObject,
                        totalRda : rdaObject
                    });
                }
            });
        }
        var db = database.ref().child('users').child('bhpuc4il4gecxSMd2gnDJv4Buif2').child('diet').child(date).child('totals');
        db.once('value', function(snapshot){
            if(snapshot.exists()){
                var nutrients = snapshot.val().totalFood;
                var rda = snapshot.val().totalRda;
                console.log(nutrients);
                res.render("dietbreakdown", {nutrients:nutrients, rda:rda});
            }
        });
    });
});

// Reroutes all other requests to a default error message (eg. page does not exist)
app.get("*", function(req, res) {
    res.render("errorPage");
});

// Activates server on port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'))
