const express = require("express");
//const { Http2ServerRequest } = require("http2");
const app = express();
const https = require("https");
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    console.log("Post requested received for: " + req.body.city);
    const query = req.body.city;
    const apiKey = "964626ae8223111ad436bec7949667a4";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, (response) => {
        console.log(response.statusCode);
        if (response.statusCode!="200") {
            console.log("Error");
        } else {
            console.log("Good Stuff!");
            response.on("data", function(data) {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const weatherDesc = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                res.write("<h1>The temperature in " + query + " is currently " + temp + " degrees Celsius</h1>");
                res.write("<p>The weather is currently " + weatherDesc + "</p>");
                res.write("<img src=" + iconURL + "></img>");
                res.send();
                
            })
            
        }
        
    })
            
})


app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})