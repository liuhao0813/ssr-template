const Detail = () => <h1>Detail</h1>

Detail.getInitialProps = () => {
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve({})
        }, 1000)
    })
}

export default Detail