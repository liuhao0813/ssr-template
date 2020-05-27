import { Button } from 'antd'
import { connect } from 'react-redux'
import getConfig from 'next/config'
import { request } from '../lib/request'

const { publicRuntimeConfig } = getConfig()

const Index = ({ username, count, add, rename }) => {

    return (
        <>
            <h1>username: {username}, count: {count}</h1>
            <Button type="primary" onClick={() => rename("wang")}>hello world</Button>
            <a href={publicRuntimeConfig.OAUTH_URL}>GITHUB LOGIN</a>
        </>
    )
}


Index.getInitialProps = async ({ctx}) => {

    // const result = await axios.get('/github/search/repositories?q=react')
    //     .then(reps=>console.log(reps))
    const result = await request({ url: '/search/repositories?q=react' }, ctx.req, ctx.res)
    return {
        data: result.data
    }

}

export default connect(
    (state) => {
        return {
        }
    },
    (dispatch) => {
        return {
        }
    }
)(Index)