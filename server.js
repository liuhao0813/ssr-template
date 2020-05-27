const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const koaBody= require('koa-body')
const Redis = require('ioredis')

const auth = require('./server/auth')
const api = require('./server/api')

const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const handle = app.getRequestHandler()

const redisClient = new Redis(6379, 'digierp.com')

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    server.keys = ['github app for nextdemo']

    const SESSION_CONFIG = {
        key: 'jid',
        store: new RedisSessionStore(redisClient)
    }

    server.use(session(SESSION_CONFIG, server))
    server.use(koaBody())

    router.get('/api/user/info', async ctx => {
        const user = ctx.session.userInfo
        if (!user) {
            ctx.status = 401
            ctx.body = 'need login'
        } else {
            ctx.body = user
            ctx.set('Content-Type', 'application/json')
        }

    })


    auth(server)
    api(server)
    
    server.use(router.routes())

    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session
        await handle(ctx.req, ctx.res)
        ctx.respond = false
    })

    server.listen(3000, () => {
        console.log("kos server listening to 3000")
    })
})


