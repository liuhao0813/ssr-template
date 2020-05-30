import { useEffect } from 'react'
import { Button, Tabs } from 'antd'
import { connect } from 'react-redux'
import getConfig from 'next/config'
import { request } from '../lib/request'
import { MailOutlined } from '@ant-design/icons'
import LRU from 'lru-cache'

import { useRouter } from 'next/router'
import Repo from '../components/Repo'

const cache = new LRU({
    maxAge: 1000 * 60 * 10
})
const { publicRuntimeConfig } = getConfig()

let cachedUserRepos, cachedUserStaredRepos

const isServer = typeof window === 'undefined'

const Index = ({ userStarredRepos, userRepos, user }) => {

    const router = useRouter()
    const tabKey = router.query.key || '1'

    useEffect(() => {
        if (!isServer) {
            // cachedUserRepos = userRepos
            // cachedUserStaredRepos = userStarredRepos
            if(userRepos){
                cache.set('userRepos', userRepos)
            }
            if(userStarredRepos){
                cache.set('userStaredRepos', userStarredRepos)
            }
        }
    }, [userStarredRepos, userRepos])

    const handleTabChange = (activeKey) => {
        router.push(`/?key=${activeKey}`)
    }

    if (!user || !user.id) {
        return (
            <>
                <div className='root'>
                    <p>亲，你还没有登录，请先登录</p>
                    <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>登录</Button>
                </div>
                <style jsx>{`
                .root{
                    height: 400px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
            </>
        )
    } else {
        return (
            <>
                <div className="root">
                    <div className="user-info">
                        <img src={user.avatar_url} alt='user avatar' className="avatar" />
                        <span className="login">{user.login}</span>
                        <span className="name">{user.name}</span>
                        <span className="bio">{user.bio}</span>
                        <p className="email">
                            <MailOutlined sytle={{ marginRight: 10 }} />
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                        </p>
                    </div>
                    <div className="user-repos">
                        <Tabs activeKey={tabKey} onChange={handleTabChange}>
                            <Tabs.TabPane tab="你的仓库" key="1">
                                {
                                    userRepos.map(repo => (
                                        <Repo key={repo.id} repo={repo} />
                                    ))
                                }
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="你关注的仓库" key="2">
                                {
                                    userStarredRepos.map(repo => (
                                        <Repo key={repo.id} repo={repo} />
                                    ))
                                }
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>

                <style jsx>{`
                    .root {
                        display: flex;
                        align-items: flex-start;
                        flex-direction: row;
                        padding: 20px 0;
                    }
                    .user-info {
                        display: flex;
                        width: 200px;
                        margin-right: 40px;
                        flex-shrink: 0;
                        flex-direction: column;
                    }
                    .login{
                        font-weight: 800;
                        font-size: 20px;
                        margin-top: 20px;
                    }
                    .name{
                        font-size: 16px;
                        color: #777;
                    }
                    .bio{
                        margin-top: 20px;
                        color: #333;
                    }
                    .avatar{
                        width: 100%;
                        border-radius: 5px;
                    }
                    .user-repos{
                        flex-grow: 1;
                    }
                `}

                </style>
            </>
        )
    }


}


Index.getInitialProps = async ({ ctx, reduxStore }) => {

    // const result = await axios.get('/github/search/repositories?q=react')
    //     .then(reps=>console.log(reps))
    // if (cachedUserRepos && cachedUserStaredRepos) {
    //     return {
    //         userRepos: cachedUserRepos,
    //         userStarredRepos: cachedUserStaredRepos
    //     }
    // }
    if(cache.get('userRepos') && cache.get('userStaredRepos')) {
        return {
            userRepos: cache.get('userRepos'),
            userStarredRepos: cache.get('userStaredRepos')
        }
    }


    const user = reduxStore.getState().user

    if (!user || !user.id) {
        return {}
    }

    const userRepos = await request({ url: '/user/repos' }, ctx.req, ctx.res)
    const userStarredRepos = await request({ url: '/user/starred' }, ctx.req, ctx.res)

    // if (isServer) {
    //     cachedUserRepos = userRepos.data
    //     cachedUserStaredRepos = userStarredRepos.data
    // }
    if (isServer) {
        cache.set('userRepos', userRepos)
        cache.set('userStaredRepos', userStarredRepos)
    }

    return {
        userRepos: userRepos.data,
        userStarredRepos: userStarredRepos.data
    }

}

export default connect(
    (state) => {
        return {
            user: state.user
        }
    },
    (dispatch) => {
        return {
        }
    }
)(Index)