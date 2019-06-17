import {GraphQLServer} from 'graphql-yoga'
import { relative } from 'path';
import { getGreeting } from './mymodule';
import { getMaxListeners } from 'cluster';

const users=[{
    id:123,
    name:'guru',
    email:'g@gmail.com',
    age:22
},{
    id:122,
    name:'charan',
    email:'gcd@gmail.com',
    age:23
},{
    id:121,
    name:'gucherryru',
    email:'gc@gmail.com',
    age:24
}]

const posts=[
    {
        id: 1,
        title:'post1' ,
        body: 'body of post1',
        isPublished: true
    },{
        id: 2,
        title:'post2' ,
        body: 'body of post 2',
        isPublished: false
    },{
        id: 3,
        title:'post3' ,
        body: 'body of post3',
        isPublished: true
    }
]

const typeDefs=`
type Query{
    me: User!
    post(query: String): [Post!]!
    users(query: String): [User!]!
}

type User{
    id: ID!
    name: String!
    email: String!
    age: Int
}

type Post{
    id: ID!
    title: String!
    body: String!
    isPublished: Boolean
}
`
const resolvers={
    Query:{
        me(){
            return {
                id: 123,
                name: 'guru',
                email: 'fss@gmail.com',
                age:22
             }
        },
        post(parent,args,ctx,info){
            if(args.query){
                return posts.filter((post)=>{
                const titles=post.title.toLowerCase().includes(args.query.toLowerCase())
                const body =  post.body.toLowerCase().includes(args.query.toLowerCase())
                console.log(titles,body)
                return titles || body
            })
        }
            if(!args.query){
                return posts
            }
        },
        users(parent,args,ctx,info){
            if(args.query){
                return users.filter(user=>user.name.toLowerCase().includes(args.query.toLowerCase()))
            }
              return users
        }
    }
    }


const server=new GraphQLServer({
    typeDefs,
    resolvers
})
server.start(()=>{
    console.log('server running')
})