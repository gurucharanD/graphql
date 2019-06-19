import uuidv4 from 'uuid/v4'
const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some(user => user.email == args.data.email)
        if (emailTaken) {
            throw new Error('email already in use')
        }
        const user = {
            id: uuidv4(),
            ...args.data
        }
        db.users.push(user)
        console.log(db.users)
        return user
    },
    deleteUser(parent, args, { db }, info) {
        let userIndex = db.users.findIndex(user => user.id == args.id)
        if (userIndex == -1) {
            throw new Error('user not found')
        }
        const deletedUser = db.users.splice(userIndex, 1)
        db.posts = db.posts.filter(post => {
            const match = post.author == args.id
            if (match) {
                db.comments = db.comments.filter(comment => comment.post == post.id)
            }
            return !match
        })
        db.comments = db.comments.filter(comment => comment.author != args.id)
        console.log(db.users)
        return deletedUser[0]
    },
    updateUser(parent, args, { db }, info) {
        const { id, data } = args
        console.log(id, args)
        const user = db.users.find(user => user.id == id)
        if (!user) {
            throw new Error('user not found!')
        }
        if (typeof data.email == 'string') {
            const emailTaken = db.users.some(user => user.email == data.email)
            if (emailTaken) {
                throw new Error('email in use')
            }
            user.email = data.email
        }
        if (typeof data.name == 'string') {
            user.name = data.name
        }
        if (typeof data.age !== undefined) {
            user.age = data.age
        }
        console.log(user)
        return user
    },
    createPost(parent, args, { db, pubsub }, info) {
        const authorExist = db.users.some(user => user.id == args.data.author)
        if (!authorExist) {
            throw new Error('author not found')
        }
        const post = {
            id: uuidv4(),
            ...args.data
        }
        db.posts.push(post)
        if (args.data.isPublished) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }
        console.log(db.posts)
        return post

    },
    deletePost(parent, args, { db, pubsub }, info) {
        let postIndex = db.posts.findIndex(post => post.id == args.id)
        if (postIndex == -1) {
            throw new Error('Post not found')
        }
        const [post] = db.posts.splice(postIndex, 1)
        db.comments = db.comments.filter(comment => comment.post != args.id)
        console.log(db.posts)
        if (post.isPublished) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }
        return post
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const post = db.posts.find(user => user.id == id)
        const originalpost = { ...post }
        if (!post) {
            throw new Error('post not found!')
        }
        if (typeof data.title == 'string') {
            post.title = data.title
        }
        if (typeof data.body == 'string') {
            post.body = data.body
        }
        if (typeof data.isPublished == 'boolean') {
            post.isPublished = data.isPublished
            if (originalpost.isPublished && !post.isPublished) {
                //deleted
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalpost
                    }
                })
            } else if (!originalpost.isPublished && post.isPublished) {
                //created
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.isPublished) {
            //updated
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }
        console.log(post)
        return post
    },
    createComment(parent, args, { db, pubsub }, info) {
        let authorValid = db.users.some(user => user.id == args.data.author)
        let postValid = db.posts.some(post => post.id == args.data.post && post.isPublished == true)
        if (!authorValid) {
            throw new Error('invalid author id')
        } else if (!postValid) {
            throw new Error('invalid post id')
        } else {
            const comment = {
                id: uuidv4(),
                ...args.data
            }
            db.comments.push(comment)
            console.log(db.comments)
            pubsub.publish('comment', {
                comment: {
                    mutation: 'CREATED',
                    data: comment
                }
            })
            return comment
        }
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        let commentIndex = db.comments.findIndex(comment => comment.id == args.id)
        if (commentIndex == -1) {
            throw new Error('Comment not found')
        }
        const [deletedComment] = db.comments.splice(commentIndex, 1)
        console.log(db.comments)
        pubsub.publish('comment', {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })
        return deletedComment
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const comment = db.comments.find(comment => comment.id == id)
        if (!comment) {
            throw new Error('comment not found!')
        }
        if (typeof data.text == 'string') {
            comment.text = data.text
        }
        console.log(comment)
        pubsub.publish('comment', {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })
        return comment
    }
}
export {
    Mutation as default
}