function getRedisSessionId(sid) {
    return `ssid:${sid}`
}

class RedisSessionStore{

    constructor(client) {
        this.client = client
    }


    // 获取redis中存储的session数据
    async get(sid) {
        const id = getRedisSessionId(sid)
        const data = await this.client.get(id)
        if (!data) {
            return null
        }

        try {
            const result = JSON.parse(data)
            return result
        } catch (err) {
            console.error(err)
        }
    }

    //存储sessionID
    async set(sid, sess, ttl) {
        const id = getRedisSessionId(sid)
        if (typeof ttl === 'number') {
            ttl = Math.ceil(ttl / 1000)
        }
        try {
            const sessStr = JSON.stringify(sess)
            if (ttl) {
                await this.client.setex(id, ttl, sessStr)
            } else {
                await this.client.set(id, sessStr)
            }
        } catch (error) {
            console.error(err)
        }
    }


    async destroy(sid) {
        const id = getRedisSessionId(sid)
        await this.client.del(id)

    }

}

module.exports = RedisSessionStore