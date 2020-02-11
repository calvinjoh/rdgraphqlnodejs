const express = require('express'); //Include Express
const app = express(); //Mengaktifkan Express
const graphqlHTTP = require('express-graphql'); //Include Express GraphQL
const schemafilemysql = require('./schema/schemamysql'); //File Schema Dengan Data Dari Database MySQL
const schemafilepostgre = require('./schema/schemapostgre'); //File Schema Dengan Data Dari Database PostgreSQL
const schemafilemongo = require('./schema/schemamongo'); //File Schema Dengan Data Dari Database PostgreSQL
const cors = require('cors'); //Include Cors
const schemafile = require('./schema/schema'); //File Schema Dengan Data Dummy

//untuk crypt
const {graphql} = require('graphql');

app.use(cors()); //Jalanin Cors

//Link GraphQL Dengan Data Dari DB Mysql 
app.use('/graphmysql', graphqlHTTP({
    schema:schemafilemysql, //File Schema Yang Dituju
    graphiql:true, //Untuk mengaktifkan GUI GraphQL pada WEB 
}));
//------------------------------

//Untuk Encrypt
function run_query(str){
    return graphql(schemafilemysql,str);
}

app.use('/graphmysqlcrypt',(req,res)=>{
        var str_query = Buffer.from(req.query.query, 'base64').toString('ascii');
        run_query(str_query).then(data => {
            var hasil = Buffer.from(JSON.stringify(data)).toString('base64');
            res.send(hasil);
        });
});
//--------------------------------------------------------------------------------

//Link GraphQL Dengan Data Dari DB Postgre 
app.use('/graphpostgre', graphqlHTTP({
    schema:schemafilepostgre, //File Schema Yang Dituju
    graphiql:true, //Untuk mengaktifkan GUI GraphQL pada WEB 
}));
//------------------------------

//Link GraphQL Dengan Data Dari DB MongoDB
app.use('/graphmongo', graphqlHTTP({
    schema:schemafilemongo, //File Schema Yang Dituju
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
