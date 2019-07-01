import getUserId from '../utils/getUserId'
const Query = {
    posts(parent, args, { prisma }, info) {
        const operationalArgs = {
            where: {
                published: true
            }
        }
        if (args.query) {
            operationalArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }
        return prisma.query.posts(operationalArgs, info)
    },
    users(parent, args, { prisma }, info) {
        const operationalArgs = {}
        if (args.query) {
            operationalArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }
        return prisma.query.users(operationalArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        return prisma.query.comments(null, info)
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)
        console.log(userId)
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info)

        if (posts.length == 0) {
            throw new Error('post not found')
        }

        return posts[0]
    },
    async me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.query.user({
            where: {
                id: userId
            }
        }, info)
    },
    async myposts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        console.log(userId)
        const operationalArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        }
        if (args.query) {
            operationalArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }
        console.log(operationalArgs)
        return prisma.query.posts(operationalArgs, info)
    }
}


export {
    Query as default
}