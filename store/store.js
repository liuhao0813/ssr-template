import { createStore, combineReducers, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'

const initialCountState = {
    count: 0
}

const ADD = 'ADD'
function countReducer(state = initialCountState, action) {
    console.log(state, action)
    switch (action.type) {
        case ADD:
            return {
                ...state,
                count: state.count + action.num || 1
            }
        default:
            return state
    }
}

const UPDATE = 'UPDATE'
const initialUserState = { username: "hello" }
function userReducer(state = initialUserState, action) {
    console.log(state, action)
    switch (action.type) {
        case UPDATE:
            return {
                ...state,
                username: action.name
            }
        default:
            return state
    }
}

const allReducer = combineReducers({
    counter: countReducer,
    user: userReducer
})


// action creator
export function update(name) {
    return {
        type: UPDATE,
        name
    }
}


// action creator
function add(num) {
    return {
        type: ADD,
        num
    }
}

// action creator
function addAsync(num) {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(add(num))
        }, 1000);
    }
}



// console.log(store.getState())
// store.dispatch({ type: ADD })
// store.dispatch(addAsync(4))
// console.log(store.getState())
// store.dispatch({ type: UPDATE, name: 'liuhao' })
// store.subscribe(()=> {
//     console.log("changed", store.getState())
// })
export default function initializeStore(state){
    const store = createStore(
        allReducer, 
        Object.assign({}, {
            counter: initialCountState,
            user: initialUserState
        }, state),
        applyMiddleware(thunk)
    )

    return store
}