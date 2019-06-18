import {GraphQLServer} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
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
        isPublished: true,
        author:123
    },{
        id: 2,
        title:'post2' ,
        body: 'body of post 2',
        isPublished: false,
        author:122
    },{
        id: 3,
        title:'post3' ,
        body: 'body of post3',
        isPublished: true,
        author:121
    }
]

const comments=[
    {
    id:1,
    text:'super',
    author:123,
    post:1
},{
   id:2,
   text: 'ok',
   author:122,
   post:2
},{
    id:3,
    text:'bad',
    author:121,
    post:3
},{
    id:4,
    text:'worst',
    author:122,
    post:2
}
]

const typeDefs=`
type Query{
    me: User!
    post(query: String): [Post!]!
    users(query: String): [User!]!
    comments : [Comment!]!
}

type Mutation{
    createUser(name:String!,email:String!,age:Int):User!
    createPost(title:String!,body:String!,published:Boolean!,author:ID!):Post!
    createComment(text:String!,author:ID!,post:ID):Comment!
}

type Comment{
    id: ID!
    text: String!
    author: User!
    post: Post!
}

type User{
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
}

type Post{
    id: ID!
    title: String!
    body: String!
    isPublished: Boolean
    author: User!
    comments: [Comment!]!
}
`
const resolvers={
    Query:{
        me(parent,args,ctx,info){
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
        },
        comments(parent,args,ctx,info){
            return comments
        }
    },
    Mutation:{
        createUser(parent,args,ctx,info){
           const emailTaken=users.some(user=>user.email===args.email)
           if(emailTaken){
                throw new Error('email already in use')
           }
           const user={
            id:uuidv4(),
            name:args.name,
            email:args.email,
            age:args.age
           }
           users.push(user)
            console.log(users)
            return user
        },
        createPost(parent,args,ctx,info){
          const authorExist=users.some(user=>user.id===args.author)
          if(!authorExist){
            throw new Error('author not found')
          }
          const post={
              id:uuidv4(),
              title:args.title,
              body:args.body,
              isPublished:args.published,
              author:args.author
          }
          posts.push(post)
          console.log(posts)
          return post
          
        },
        createComment(parent,args,ctx,info){
           let authorValid=users.some(user=>user.id===args.author)
           let postValid=posts.some(post=>post.id===args.post&&post.isPublished==true)
           if(!authorValid){
            throw new Error('invalid author id')
           }else if(!postValid){
               throw new Error('invalid post id')
           }else{
               const comment={
                   id:uuidv4(),
                   text:args.text,
                   author:args.author,
                   post:args.post
               }
               comments.push(comment)
               console.log(comment)
               return comment
           }
        }
    },
    Post:{
        author(parent){
          return users.find(user=>user.id==parent.author)
        },
        comments(parent){
            return comments.filter(comment=>comment.id==parent.id)
          }
    },
    User:{
        posts(parent){
          return posts.filter(post=>post.author==parent.id)
        },
        comments(parent){
          return comments.filter(comment=>comment.author==parent.id)
        }
    },
    Comment:{
        author(parent){
          return users.find(user=>user.id==parent.author)
        },
        post(parent){
            return posts.find(post=>post.id==parent.post)
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