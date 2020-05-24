import { Button } from 'antd'
import { connect } from 'react-redux'

import { update } from '../store/store'

const Index = ({username, count, add, rename}) => {
    return (
        <>
        <h1>username: {username}, count: {count}</h1>
        <Button type="primary" onClick={()=>rename("wang")}>hello world</Button>
        </>
    )
}


Index.getInitialProps =  async({reduxStore}) => {
    reduxStore.dispatch(update('张三'))
    return {}
}

export default connect(
    (state) => {
        return {
            username: state.user.username,
            count: state.counter.count
        }
    }, 
    (dispatch) => {
        return {
            add: (num)=>dispatch({type: 'ADD', num}),
            rename: (name)=>dispatch({type: 'UPDATE', name})
        }
    }
)(Index)