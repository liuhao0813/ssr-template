const axios = require('axios')
const config = require('../config')

const { client_id, client_secret, request_token_url } = config.github

module.exports = (server) => {
    server.use(async (ctx, next) => {
        if (ctx.path === '/auth') {
            const code = ctx.query.code
            if (!code) {
                ctx.body = 'code not exist'
                return
            }

            const result = await axios({
                method: 'post',
                url: request_token_url,
                data: {
                    client_id,
                    client_secret,
                    code
                },
                headers: {
                    Accept: 'application/json'
                }
            })
            if (result.status === 200 && (result.data && !result.data.error)) {
                ctx.session.githubAuth = result.data
                const {access_token, token_type} = result.data
                const userInfoRes = await axios({
                    method: 'get',
                    url: 'https://api.github.com/user',
                    headers: {
                        'Authorization': `${token_type} ${access_token}`
                    }
                })
                
                ctx.session.userInfo = userInfoRes.data
                ctx.redirect('/')
            } else {
                const errorMessage  = result.data && result.data.error
                ctx.body = `request token failed ${errorMessage}`
            }

        } else {
            await next()
        }
    })
}