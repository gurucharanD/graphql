import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: 'prismasecret',
    fragmentReplacements
})
export { prisma as default }

// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({ id: postId })
//     if (!postExists) {
//         throw new Error('Post not found')
//     }
//     const post = await prisma.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data: { ...data }
//     }, '{id title author{id name posts {id title published}}}')
//     // const user = await prisma.query.user({
//     //     where: {
//     //         id: post.author.id
//     //     }
//     // })
//     return post.author
// }
// updatePostForUser("abc", {
//     published: false
// }).then(user => console.log(JSON.stringify(user, undefined, 2))).catch(err => console.log(err))
// const createPostForUser = async (authorId, data) => {
//     const userExists = await prisma.exists.User({ id: authorId })
//     if (!userExists) {
//         throw new Error('user not found')
//     }
//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{id}')
//     const user = await prisma.query.user({
//         where: {
//             id: authorId
//         }
//     }, '{id name email posts{ id title published}}')
//     console.log(user, post)
//     return user
// }
// createPostForUser("abcd", {
//     title: "uising mututation",
//     body: "sample body",
//     published: true
// }).then(user => console.log(JSON.stringify(user, undefined, 2))).catch(err => console.log(err))

//prisma.query(operational args,selection set)
//prisma.mutations(operational args,selection set)
//prisma.subscriptions
//prisma.exists

// prisma.query.users(null, '{id name email posts {id title}}').then(data => {
//     console.log(JSON.stringify(data,undefined,2))
// })

// prisma.query.comments(null, '{id text author {id name} post { id title} }').then(data => console.log(JSON.stringify(data, undefined, 2)))

// prisma.mutation.createUser({
//     data: {
//         name: "gurucharan",
//         email: "gurug@gmail.com"
//     }
// }, '{id name email}').then(data => console.log(JSON.stringify(data, undefined, 2)))

// prisma.mutation.createPost({
//     data: {
//         title: "gurucharan",
//         body: "gurubody",
//         published: true,
//         author: {
//             connect: {
//                 id: "cjx94701702fo0759m79n1sh0"
//             }
//         }
//     }
// }, '{id title author {id name }}').then(data => console.log(JSON.stringify(data, undefined, 2)))

// prisma.mutation.updatePost({
//     data: {
//         published: false,
//         title: "demo2"
//     },
//     where: {
//         id: "cjx90oopt01sr07595s2d0qs4"
//     }
// }, '{id title author{name}}').then(data => {
//     console.log(JSON.stringify(data, undefined, 2))
//     return prisma.query.posts(null, '{id title body author {name}}')
// }).then(data => console.log(JSON.stringify(data, undefined, 2)))

// prisma.exists.User({ name: "Guru" }).then(data => console.log(data));