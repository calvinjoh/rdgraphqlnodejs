const graphql=require('graphql');
const _=require('lodash');
const {GraphQLSchema,GraphQLObjectType,GraphQLList,GraphQLString,GraphQLID,GraphQLInt} = graphql;

//dummy data
var books=[
    {name:"To Kill a Mockingbird",genre:"Classic",id:"1",id_author_fk:"3"},
    {name:"Romeo and Juliet",genre:"Classic",id:"2",id_author_fk:"2"},
    {name:"V for Vendetta",genre:"Comic",id:"3",id_author_fk:"1"},
    {name:"Sherlock Holmes",genre:"Crime",id:"4",id_author_fk:"1"},
]
var author=[
    {name:"Author A",age:"32",id:"1"},
    {name:"Author B",age:"28",id:"2"},
    {name:"Author C",age:"34",id:"3"},
]
//---------------------


//Membuat Tipe Field Pada Obejct / Sebagai Bentuk Jsonnya Nanti
const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{ //untuk relasi
            type:AuthorType,
            resolve(parents,args){
                return _.find(author,{id:parents.id_author_fk});
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        booklist:{
            type:new GraphQLList(BookType), //Untuk Relasi Dengan Bentuk List
            resolve(parents,args){
                return _.filter(books,{id_author_fk:parents.id}); //Filter Berdasarkan Id Author Yang Dicari
            }
        }
    })
})
//---------------------------------

//Untuk Root Query Atau Sebagai Route Pemanggilan Ke Object
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLID}},
            resolve(parents,args){
                return _.find(books,{id:args.id});
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parents,args){
                return _.find(author,{id:args.id});
            }
        },
        books:{ //Untuk Mengambil Semua Data Buku Tanpa Kondisi Where ID Tertentu
            type:new GraphQLList(BookType),
            resolve(parents,args){
                return books;
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parents,args){
                return author;
            }
        }
    }
})
//------------------------------------------

//Untuk Export Schema Dengan Query Dari Variabel RootQuery
module.exports= new GraphQLSchema({
    query:RootQuery
})
//-------------------------------------------