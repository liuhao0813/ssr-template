import { useState, useCallback } from 'react'
import { Layout, Avatar, Input, Dropdown, Menu, Tooltip } from 'antd'
import { GithubOutlined, UserOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import getConfig from 'next/config'
import Container from './Container'
import { logout } from '../store/store'
import Axios from 'axios'
import { withRouter } from 'next/router'

const { Header, Content, Footer } = Layout
const { publicRuntimeConfig } = getConfig()

const githubLogoStyle = {
    color: 'white',
    fontSize: 40,
    display: 'block',
    paddingTop: 10,
    marginRight: 20,
}

function MyLayout({ children, user, logout, router }) {

    const [search, setSearch] = useState('')

    const handleSearchChange = useCallback(
        (event) => {
            setSearch(event.target.value)
        },
        [setSearch],
    )

    const handleSearch = useCallback(
        () => { }
    )

    const handleLogout = useCallback(() => {
        logout()
    }, [logout])


    const handleGotoOAuth = useCallback((event) => {
        event.preventDefault()
        Axios.get(`/prepare-auth?url=${router.asPath}`).then((resp) => {
            if (resp.status === 200) {
                location.href = publicRuntimeConfig.OAUTH_URL
            } else {
                console.log('prepare auth failed', resp)
            }
        }).catch(err => {
            console.log('prepare auth failed', err)
        })
    }, [])

    const userDropDown = (
        <Menu>
            <Menu.Item>
                <a href="javascript: void(0)" onClick={handleLogout}>
                    登出
                </a>
            </Menu.Item>
        </Menu>
    )
    return (
        <Layout>
            <Header>
                <Container renderer={<div className="header-inner" />}>

                    <div className="header-left">
                        <div className="logo">
                            <GithubOutlined style={githubLogoStyle} />
                        </div>
                        <div>
                            <Input.Search placeholder="搜索仓库"
                                value={search}
                                onChange={handleSearchChange}
                                onSearch={handleSearch} />
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="user">
                            {
                                user && user.id ? (
                                    <Dropdown overlay={userDropDown}>
                                        <Avatar src={user.avatar_url} size={40} />
                                    </Dropdown>
                                ) : (
                                        <Tooltip title="点击进行登录">
                                            <a href={publicRuntimeConfig.OAUTH_URL} onClick={handleGotoOAuth}>
                                                <Avatar icon={<UserOutlined />} size={40} />
                                            </a>
                                        </Tooltip>
                                    )
                            }

                        </div>
                    </div>
                </Container>
            </Header>
            <Content>
                <Container renderer={<div />}>
                    {children}
                </Container>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            <style jsx>{`
                .header-inner{
                    display: flex;
                    justify-content: space-between;
                }
                .header-left{
                    display: flex;
                    justify-content: flex-start;
                }
            `}</style>
            <style jsx global>{`
                #__next{
                    height: 100%;
                }
                .ant-layout{
                    min-height: 100%;
                }
                .ant-layout-header {
                    padding:0;
                }
            `}</style>
        </Layout>
    )
}

export default withRouter(connect((state) => {
    return {
        user: state.user,
    }
}, (dispatch) => {
    return {
        logout: () => dispatch(logout())
    }
})(MyLayout))