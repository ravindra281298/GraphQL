const express=require('express');
const expressGraphQL=require('express-graphql');

const {
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt
}=require('graphql')

const app=express();

const authors=[
    {id:1,name:"J. K. Rowling"},
    {id:2,name:"J. R. R. Tolkien"},
    {id:3,name:"Brent Weeks"}
]

const books=[
    {id:1,name:"Harry Potter and the Chamber of secrets",authorId:1},
    {id:2,name:"Harry potter and the Prisoner of Azkaban",authorId:1},
    {id:3,name:"Harry potter and the Goblet of Fire",authorId:1},
    {id:4,name:"The Fellowship of the Ring",authorId:2},
    {id:5,name:"The Two Towers",authorId:2},
    {id:6,name:"The return of the King",authorId:2},
    {id:7,name:"The way of Shadows",authorId:3},
    {id:8,name:"Beyond the Shadows",authorId:3},    
]

const authorType=new GraphQLObjectType({
    name:'Author',
    description:'This represents the Author of a book.',
    fields:()=>({
        id:{type: GraphQLNonNull(GraphQLInt)},
        name:{type: GraphQLNonNull(GraphQLString)},
        book:{
            type: new GraphQLList(BookType),
            resolve:(author)=>{
                return books.filter(book=>book.authorId===author.id)
            }
        }
    })
})

const BookType=new GraphQLObjectType({
    name:'Book',
    description:'This represent a Book written by: ',
    fields:()=>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name:{type: GraphQLNonNull(GraphQLString)},
        authorId:{type:GraphQLNonNull(GraphQLInt)},
        author:{
            type: authorType,
            resolve:(books)=>{
                return authors.find(author=> author.id===books.authorId)
            }
        }
    })
});

const rootQueryType=new GraphQLObjectType({
    name:'Query',
    description:'Root Query',
    fields:()=>({
        book:{
            type:BookType,
            description:'Display single book.',
            args:{
                id:{type: GraphQLInt}
            },
            resolve:(parent,args)=> books.find(book=> book.id===args.id)
        },
        books:{
            type: new GraphQLList(BookType),
            description: 'List of All Books.',
            resolve: ()=> books
        },
        author:{
            type: new GraphQLList(authorType),
            description: 'List of All Authors.',
            resolve: ()=> authors
        }
    }) 
});


// const schema=new GraphQLSchema({
//     query:new GraphQLObjectType({
//         name:'helloWorld',
//         fields: ()=>({
//             message :{
//                 type: GraphQLString,
//                 resolve: ()=> 'helloWorld'
//             }
//         })
//     })
// });

const schema=new GraphQLSchema({
    query:rootQueryType
});

app.use('/graphql',expressGraphQL({
    schema: schema,
    graphiql:true
}));


const port=3000;
const hostname="localhost";
app.listen(port,hostname,()=>{
    console.log(`running at http://${hostname}:${port}`);
});