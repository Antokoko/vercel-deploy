const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//cambios
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/c519e0d986";

    const options = {
        method: "POST",
        auth: "grecia3:62829b3ca87595be463a16262c34efbb-us11"
    }

    const request1 = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request1.write(jsonData);
    request1.end();
});

app.post("/failure", function(req, res){
    res.redirect("/")
});

app.post("/success", function(req, res){
    res.redirect("/")
})

app.listen(port, function(){
    console.log("Server is running on port 3000");
});
