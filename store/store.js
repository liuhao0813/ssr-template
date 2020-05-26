import { createStore, combineReducers, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import axios from 'axios'

const initialUserState={}

const LOGOUT = 'LOGOUT'
function userReducer(state = initialUserState, action) {
    switch (action.type) {
        case LOGOUT: {
            return {}
        }
        default:
            return state
    }
}

const allReducer = combineReducers({
    user: userReducer
})

export function logout(){
    return dispatch=>{
        axios.post('/logout').then((resp)=>{
            if(resp.status === 200){
                dispatch({
                    type: LOGOUT
                })
            }else {
                console.log('logout failed', resp)
            }
        }).catch(err=>{
            console.error('dddd')
        })
    }
}

export default function initializeStore(state){
    const store = createStore(
        allReducer, 
        Object.assign({}, {
            user: initialUserState
        }, state),
        composeWithDevTools(applyMiddleware(thunk))
    )

    return store
}