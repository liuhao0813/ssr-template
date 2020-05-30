const axios = require('axios')
const github_base_url = 'https://api.github.com'

async function requestGithub(method, url, data, headers){
    try {
        axios.defaults.timeout = 15000;           //超时时间
        axios.defaults.retry = 3;                 //请求次数
        return await axios({
            method,
            url: `${github_base_url}${url}`,
            data,
            headers
        })
    } catch (error) {
        console.error('requestGithub请求EROOR')
        console.log(error)
    }
    
}

const isServer = typeof window ==='undefined'
async function request({method ='GET', url, data={}}, req, res){
    if(!url){
        throw Error('url must provide')
    }
    if(isServer){
        const session = req.session
        const githubAuth = session.githubAuth || {}
        
        const headers = {}
        if(githubAuth.access_token){
            headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
        }
        try {
            return await requestGithub(method, url, data, headers)    
        } catch (error) {
            console.log("request file request function ")
        }
        
    }else{
        return await axios({
            method,
            url: `/github${url}`,
            data
        })
    }
}

module.exports = {
    request, 
    requestGithub
}