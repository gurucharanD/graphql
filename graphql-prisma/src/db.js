const users = [
    {
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

const posts = [
    {
        id: 10,
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
        id: 12,
        title: 'post3',
        body: 'body of post3',
        isPublished: true,
        author: 121
    }
]

const comments = [
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


const db = { users, posts, comments }
export {
    db as default
}