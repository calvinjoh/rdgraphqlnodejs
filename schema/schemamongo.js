const graphql=require('graphql');
const _=require('lodash');
const Mongoose = require("mongoose");

Mongoose.connect("mongodb://localhost:27017/test_graphql");

const {GraphQLSchema,GraphQLObjectType,GraphQLList,GraphQLString,GraphQLID,GraphQLInt} = graphql;

const bookModel = Mongoose.model("book",{
    id: Number,
    id_author_fk: Number,
    name: String,
    genre: String
});

const authorModel = Mongoose.model("author",{
    id: Number,
    name: String,
    age: Number
})

//Membuat Tipe Field Pada Obejct / Sebagai Bentuk Jsonnya Nanti
const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLID}, //id dengan jenis ID
        id_author_fk:{type:GraphQLID},//id_author_fk dengan jenis ID
        name:{type:GraphQLString}, //name dengan jenis String
        genre:{type:GraphQLString}, //genre dengan jenis String
        list_author:{ //untuk relasi ke author
            type:new GraphQLList(AuthorType), //untuk menampilkan author dalam bentuk list
            resolve(parents,args){
                //handle error
                if(parents.id_author_fk==null){
                    throw new Error( //return untuk error jika data book tidak ada
                        "Data Book Is Empty"
                      );      
                }
                return authorModel.find({id:parents.id_author_fk}).exec();
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLID},//id dengan jenis ID
        name:{type:GraphQLString},//name dengan jenis String
        age:{type:GraphQLInt}//Age dengan jenis Integer
    })
})
//---------------------------------

//Untuk Root Query Atau Sebagai Route Pemanggilan Ke Object
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        get_data_book:{
            type:GraphQLList(BookType),
            resolve(parents,args){ //untuk mengambil datanya
                return bookModel.find({}).exec();
            }
        },
        get_data_book_detail:{
            type:BookType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parents,args){ //untuk mengambil datanya
                return bookModel.find({id:args.id}).exec();
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parents,args){
                return authorModel.find({id:args.id}).exec();
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parents,args){
                return authorModel.find({}).exec();
            }
        }
    }
})
//------------------------------------------


//Untu CREATE,UPDATE,DELETE data
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields:{
        add_book:{ //Untuk tambah data book 
            type:BookType,
            args:{
                id:{type:GraphQLID},
                id_author_fk:{type:GraphQLID},
                name:{type:GraphQLString},
                genre:{type:GraphQLString},
            },
            resolve(parents,args){
                var add_book = new bookModel(args);
                return add_book.save();
            }
        },
        add_author:{ //Untuk tambah data book 
            type:AuthorType,
            args:{
                id:{type:GraphQLID},
                name:{type:GraphQLString},
                age:{type:GraphQLInt},
            },
            resolve(parents,args){
                var add_author = new authorModel(args);
                return add_author.save();
            }
        },
        update_book:{ //Untuk ubah data book 
            type:BookType,
            args:{
                id:{type:GraphQLID},
                id_author_fk:{type:GraphQLID},
                name:{type:GraphQLString},
                genre:{type:GraphQLString},
            },
            resolve(parents,args){
                return bookModel.updateOne({
                    id:args.id
                },args);
            }
        },
        delete_book:{ //Untuk hapus data book 
            type:BookType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parents,args){
                return bookModel.deleteOne({
                    id:args.id
                })
            }
        },
    }
});


// koneksi.end();

//Untuk Export Schema Dengan Query Dari Variabel RootQuery
module.exports= new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
})
//-------------------------------------------


