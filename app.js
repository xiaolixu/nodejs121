/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

console.log("======================output for env variables======================");
var services = JSON.parse(process.env.VCAP_SERVICES);
console.log("process.env.VCAP_APPLICATION :"+services)
console.log("process.env.VCAP_SERVICES :"+process.env.VCAP_SERVICES)

console.log("process.env.NATURAL_LANGUAGE_UNDERSTANDING_USERNAME :" + process.env.NATURAL_LANGUAGE_UNDERSTANDING_USERNAME);
console.log("process.env.NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD :" + process.env.NATURAL_LANGUAGE_UNDERSTANDING_USERNAME);

//var nlu_config = services.natural-language-understanding[0];
//console.log("nlu_config :"+nlu_config);
//var nlu_username = nlu_config.credentials.username;
//console.log("nlu_username :"+nlu_username);
//var nlu_password = nlu_config.credentials.password;
//console.log("nlu_password :"+nlu_password);
console.log("===========================End===============================");

'use strict';
const fs = require('fs');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
require('dotenv').config({ silent: true }); //  optional

const nlu = new NaturalLanguageUnderstandingV1({
  // note: if unspecified here, credentials are pulled from environment properties:
  // NATURAL_LANGUAGE_UNDERSTANDING_USERNAME &  NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD
  //username: '6556a737-8135-4f01-a0f0-a177b6dca4d1',
  //password: 'zlPWIsGMEjDJ',
  username: nlu_username,
  password: nlu_password,
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2016_01_23
});

const filename = 'energy-policy.html';

app.get('/', function(req, res) {
  fs.readFile(filename, 'utf-8', function(file_error, file_data) {
    if (file_error) {
      console.log(file_error);
    } else {
      const options = {
        html: file_data,
        features: {
          concepts: {},
          keywords: {}
        }
      };
      nlu.analyze(options, function(err, jsonResult) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(JSON.stringify(jsonResult,null,2));
        res.send(JSON.stringify(jsonResult,null,2));
      });
    }
  });	  
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
