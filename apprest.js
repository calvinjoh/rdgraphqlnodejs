const schemafilemysqlrest = require('./schema/schemamysqlpoolrest');
const cors = require('cors'); //Include Cors

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3001;

app.use(cors()); //Jalanin Cors

app.get('/getbooks', function (req, res) {
    schemafilemysqlrest.get_book().then(function(result){
        // res.send(result);
        res.status(200).send({"response": result});
    });
 })

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);