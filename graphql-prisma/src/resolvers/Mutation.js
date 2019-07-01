import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'
const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        if (args.data.password.length < 8) {
            throw new Error('password should be 8 characters long')
        }
        const password = await bcrypt.hash(args.data.password, 10)
        const emailTaken = await prisma.exists.User({ email: args.data.email })
        console.log(emailTaken)
        if (emailTaken) {
            throw new Error('email in use')
        }
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })
        return {
            user,
            token: jwt.sign({ userId: user.id }, 'secret')
        }
    },
    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)
    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },
    async createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)

    },
    async deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })
        if (!postExists) {
            throw new Error('unable to delete post')
        }
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    async updatePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })
        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        })
        console.log('now', isPublished && args.data.published === false)
        if (isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }
        if (!postExists) {
            throw new Error('unable to update post')
        }
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            }, data: args.data
        }, info)
    },
    async createComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.data.post,
            published: true
        })
        if (!postExists) {
            throw new Error('post doesn\'t exist')
        }
        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })
        if (!commentExists) {
            throw new Error('unable to delete commet')
        }
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })
        if (!commentExists) {
            throw new Error('unable to update commet')
        }
        const comemntExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })
        if (!comemntExists) {
            throw new Error('unable to update comment')
        }
        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })
        if (!user) {
            throw new Error('Unable to login')
        }
        const isMatch = await bcrypt.compare(args.data.password, user.password)
        if (!isMatch) {
            throw new Error('Unable to login')
        }
        return {
            user,
            token: jwt.sign({ userId: user.id }, 'secret')
        }
    }
}
export {
    Mutation as default
}