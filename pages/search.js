import {withRouter} from 'next/router'
const Search = ({router}) => {
    const {query}= router.query
    return (
    <div>{query}</div>
    )
}

export default  withRouter(Search)