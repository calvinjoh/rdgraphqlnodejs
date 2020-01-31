const express = require('express'); //Include Express
const app = express(); //Mengaktifkan Express
const graphqlHTTP = require('express-graphql'); //Include Express GraphQL
const schemafilemysql = require('./schema/schemamysql'); //File Schema Dengan Data Dari Database MySQL
const cors = require('cors'); //Include Cors
const schemafile = require('./schema/schema'); //File Schema Dengan Data Dummy

app.use(cors()); //Jalanin Cors

//Link GraphQL Dengan Data Dari DB Mysql 
app.use('/graphmysql', graphqlHTTP({
    schema:schemafilemysql, //File Schema Yang Dituju
    graphiql:true, //Untuk mengaktifkan GUI GraphQL pada WEB 
}));
//------------------------------

app.listen(3000, () =>{ //Menjalankan Serve Node.JS Pada Port 3000 (localhost:3000)
    return console.log('Request On Port 3000');
});

//Link GraphQL Dengan Data Dummy 
app.use('/graph', graphqlHTTP({
    schema:schemafile, //File Schema Yang Dituju
    graphiql:true //Untuk mengaktifkan GUI GraphQL pada WEB 
}));
//------------------------------
