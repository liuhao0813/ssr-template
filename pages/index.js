import {useEffect} from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import getConfig from 'next/config'
import { update } from '../store/store'

import axios  from 'axios'

const {publicRuntimeConfig} = getConfig()

const Index = ({username, count, add, rename}) => {

    return (
        <>
        <h1>username: {username}, count: {count}</h1>
        <Button type="primary" onClick={()=>rename("wang")}>hello world</Button>
        <a href={publicRuntimeConfig.OAUTH_URL}>GITHUB LOGIN</a>
        </>
    )
}


Index.getInitialProps =  async() => {
    return {}
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