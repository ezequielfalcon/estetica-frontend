/**
 * Created by eze on 25/01/17.
 */
const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 5000, function(){
  console.log("Frontend iniciado!");
});

