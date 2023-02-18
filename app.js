const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
// const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  console.log(req.body);

  //get values from the signup page
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  //   Javascript Object to be stored in Mailchimp server
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  //   Convert Javascript object into json
  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/a9d33ca963";
  const options = {
    method: "POST",
    auth: "aadil:A92e6e73bf67de155b8903d8909c160d4-us21",
  };

  const request = https.request(url, options, (response) => {
    var statusCode = response.statusCode;
    console.log("status code " + statusCode);
    if (statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else if (statusCode === 401) {
      res.sendFile(__dirname + "/failure.html");
    }
    // response.on("data", (data) => {
    //   console.log(JSON.parse(data));
    // });
  });

  //   Write the input json data on mailchimp
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/home", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
// "process.env.PORT" will help to run our app dynamically on Heroku servers
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on Port 3000");
});

// mail chimp API Key
// 92e6e73bf67de155b8903d8909c160d4-us21

// list Id
// a9d33ca963
