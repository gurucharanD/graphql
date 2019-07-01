import getUserId from '../utils/getUserId'
const Subscription = {
    comment: {
        subscribe(parent, { postId }, { prisma }, info) {
            return prisma.subscription.comment({
                where: {
                    node: {
                        post: {
                            id: postId
                        }
                    }
                }
            }, info)//(operational args,query output)
        }
    },
    // user: {
    //     subscribe(parent, { postId }, { db, pubsub }, info) {
    //         const post = db.posts.find((post) => post.id == postId && post.isPublished)
    //         console.log(post, postId)
    //         if (!post) {
    //             throw new Error('Post not found')
    //         }
    //         return pubsub.asyncIterator('comment')
    //     }
    // },
    post: {
        subscribe(parent, args, { prisma }, info) {
            return prisma.subscription.post({
                where: {
                    node: {
                        published: true
                    }
                }
            }, info)
        }
    },
    mypost: {
        subscribe(parent, args, { prisma, request }, info) {
            const userId = getUserId(request)
            return prisma.subscription.post({
                where: {
                    node: {
                        author: {
                            id: userId
                        }
                    }
                }
            }, info)
        }
    }
}

export { Subscription as default }