const Query = {
    posts(parent, args, { db }, info) {
        if (args.query) {
            return db.posts.filter((post) => {
                const titles = post.title.toLowerCase().includes(args.query.toLowerCase())
                const body = post.body.toLowerCase().includes(args.query.toLowerCase())
                console.log(titles, body)
                return titles || body
            })
        }
        if (!args.query) {
            return db.posts
        }
    },
    users(parent, args, ctx, info) {
        if (args.query) {
            return ctx.db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
        }
        return ctx.db.users
    },
    comments(parent, args, { db }, info) {
        return db.comments
    }
}


export {
    Query as default
}