const _=require('lodash');
const mysql = require('mysql');



var koneksi=mysql.createPool({
    host:'localhost',
    user:"root",
    password:"",
    database:"test_graphql",
    connectionLimit: 2,
    // queryTimeout: 20
})

function query_mysql(query, callback){
    return new Promise((resolve,reject)=>{ //Untuk return data 
        var result = [{}];
        koneksi.getConnection(function(error, connection){    
            //run the query
            connection.query(query,  function(err, rows){
                connection.destroy();

                if(error){
                    reject(error);
                }
                
                if(rows){
                    if(rows.length>0){
                        result = JSON.parse(JSON.stringify(rows));
                        resolve(result);
                    }
                }
    
                resolve([{}]);
            });
            // connection.destroy();//release the connection
            // resolve(result);
          });
    })
}


exports.get_book = function get_book(req,res){
    return new Promise((resolve,reject)=>{ //Untuk return data   
        query_mysql('SELECT * FROM book').then(function(result){
            resolve(result);
        });
    })
}


