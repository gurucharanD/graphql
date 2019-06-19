import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
let users = [{
    id: 123,
    name: 'guru',
    email: 'g@gmail.com',
    age: 22
}, {
    id: 122,
    name: 'charan',
    email: 'gcd@gmail.com',
    age: 23
}, {
    id: 121,
    name: 'gucherryru',
    email: 'gc@gmail.com',
    age: 24
}]

let posts = [
    {
        id: 1,
        title: 'post1',
        body: 'body of post1',
        isPublished: true,
        author: 123
    }, {
        id: 2,
        title: 'post2',
        body: 'body of post 2',
        isPublished: false,
        author: 122
    }, {
        id: 3,
        title: 'post3',
        body: 'body of post3',
        isPublished: true,
        author: 121
    }
]

let comments = [
    {
        id: 1,
        text: 'super',
        author: 123,
        post: 1
    }, {
        id: 2,
        text: 'ok',
        author: 122,
        post: 2
    }, {
        id: 3,
        text: 'bad',
        author: 121,
        post: 3
    }, {
        id: 4,
        text: 'worst',
        author: 122,
        post: 2
    }
]

const typeDefs = `
type Query{
    me: User!
    post(query: String): [Post!]!
    users(query: String): [User!]!
    comments : [Comment!]!
}

type Mutation{
    createUser(data:CreateUserInput):User!
    deleteUser(id:ID!):User!
    createPost(data:CreatePostInput):Post!
    deletePost(id:ID!):Post!
    createComment(data:CreateCommentInput):Comment!
    deleteComment(id:ID!):Comment!
}

input CreateUserInput{
    name:String!
    email:String!
    age:Int
}

input CreatePostInput{
    title:String!
    body:String!
    isPublished:Boolean!
    author:ID!
}

input CreateCommentInput{
    text:String!
    author:ID!
    post:ID!
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
const resolvers = {
    Query: {
        me(parent, args, ctx, info) {
            return {
                id: 123,
                name: 'guru',
                email: 'fss@gmail.com',
                age: 22
            }
        },
        post(parent, args, ctx, info) {
            if (args.query) {
                return posts.filter((post) => {
                    const titles = post.title.toLowerCase().includes(args.query.toLowerCase())
                    const body = post.body.toLowerCase().includes(args.query.toLowerCase())
                    console.log(titles, body)
                    return titles || body
                })
            }
            if (!args.query) {
                return posts
            }
        },
        users(parent, args, ctx, info) {
            if (args.query) {
                return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
            }
            return users
        },
        comments(parent, args, ctx, info) {
            return comments
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.data.email)
            if (emailTaken) {
                throw new Error('email already in use')
            }
            const user = {
                id: uuidv4(),
                ...args.data
            }
            users.push(user)
            console.log(users)
            return user
        },
        deleteUser(parent, args, ctx, info) {
            let userIndex = users.findIndex(user => user.id == args.id)
            if (userIndex == -1) {
                throw new Error('user not found')
            }
            const deletedUser = users.splice(userIndex, 1)
            posts = posts.filter(post => {
                const match = post.author == args.id
                if (match) {
                    comments = comments.filter(comment => comment.post == post.id)
                }
                return !match
            })
            comments = comments.filter(comment => comment.author != args.id)
            console.log(users)
            return deletedUser[0]
        },
        createPost(parent, args, ctx, info) {
            const authorExist = users.some(user => user.id === args.data.author)
            if (!authorExist) {
                throw new Error('author not found')
            }
            const post = {
                id: uuidv4(),
                ...args.data
            }
            posts.push(post)
            console.log(posts)
            return post

        },
        deletePost(parent, args, ctx, info) {
            let postIndex = posts.findIndex(post => post.id == args.id)
            if (postIndex == -1) {
                throw new Error('Post not found')
            }
            const deletedPost = posts.splice(postIndex, 1)
            comments = comments.filter(comment => comment.post != args.id)
            console.log(posts)
            return deletedPost[0]
        },
        createComment(parent, args, ctx, info) {
            let authorValid = users.some(user => user.id === args.data.author)
            let postValid = posts.some(post => post.id === args.data.post && post.isPublished == true)
            if (!authorValid) {
                throw new Error('invalid author id')
            } else if (!postValid) {
                throw new Error('invalid post id')
            } else {
                const comment = {
                    id: uuidv4(),
                    ...args.data
                }
                comments.push(comment)
                console.log(comment)
                return comment
            }
        },
        deleteComment(parent, args, ctx, info) {
            let commentIndex = comments.findIndex(comment => comment.id == args.id)
            if (commentIndex == -1) {
                throw new Error('Comment not found')
            }
            const deletedComment = comments.splice(commentIndex, 1)
            console.log(comments)
            return deletedComment[0]
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id == parent.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.id == parent.id)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author == parent.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author == parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id == parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id == parent.post)
        }
    }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})
server.start(() => {
    console.log('server running')
})