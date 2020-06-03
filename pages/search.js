import { memo, isValidElement } from 'react'
import { useRouter } from 'next/router'
import { List, Col, Row, Pagination } from 'antd'
import Link from 'next/Link'
import { request } from '../lib/request'

import Repo from '../components/Repo'

const LANGUAGES = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust']

const SORT_TYPES = [
    {
        name: 'Best Match'
    },
    {
        name: 'Most Stars',
        value: 'stars',
        order: 'desc'
    },
    {
        name: 'Fewest Stars',
        value: 'stars',
        order: 'asc'
    },
    {
        name: 'Most forks',
        value: 'forks',
        order: 'desc'
    },
    {
        name: 'Fewest forks',
        value: 'forks',
        order: 'asc'
    }
]

const selectedItemStyle = {
    borderLeft: '2px solid #e36209',
    fontWeight: 100
}

function noop() { }

const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
    let queryString = `?q=${query}`
    if (lang) queryString += `&lang=${lang}`
    if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
    if (page) queryString += `&page=${page}`

    return (
        // <a onClick={()=>doSearch()}>{name}</a>
        <Link href={`/search${queryString}`}>
            {isValidElement(name) ? name : <a>{name}</a>}
        </Link>
    )
})

const Search = ({ repos }) => {
    const router = useRouter();
    const { sort, order, lang, page } = router.query

    return (
        <div className="root">
            <Row gutter={20}>
                <Col span={6}>
                    <List bordered
                        header={<span className='list-header'>语言</span>}
                        style={{ marginBottom: 20 }}
                        dataSource={LANGUAGES}
                        renderItem={item => {
                            const selected = lang === item

                            return (
                                <List.Item style={selected ? selectedItemStyle : null}>
                                    {
                                        selected ? <span>{item}</span> : (
                                            <FilterLink {...router.query} lang={item} name={item}></FilterLink>
                                        )
                                    }
                                </List.Item>
                            )
                        }}
                    />

                    <List bordered
                        header={<span className='list-header'>排序</span>}
                        style={{ marginButtom: 20 }}
                        dataSource={SORT_TYPES}
                        renderItem={item => {
                            let selected = false;
                            if (item.name === 'Best Match' && !sort) {
                                selected = true;
                            } else if (item.value === sort && item.order === order) {
                                selected = true
                            }
                            return (
                                <List.Item style={selected ? selectedItemStyle : null}>
                                    {
                                        selected ? <span>{item.name}</span> : (
                                            <FilterLink {...router.query} sort={item.value} order={item.order} name={item.name} />
                                        )
                                    }
                                </List.Item>
                            )
                        }}
                    />
                </Col>
                <Col span={18}>
                    <h3 className="repos-total">{repos.total_count}</h3>
                    {
                        repos.items.map(repo => (
                            <Repo key={repo.id} repo={repo} />
                        ))
                    }
                    <div className="pagination">
                        <Pagination
                            pageSize={30}
                            current={Number(page) || 1}
                            total={repos.total_count}
                            onChange={noop}
                            itemRender={(page, type, ol) => {
                                const p = type === 'page' ? page : type === 'prev' ? page - 1 : page + 1
                                const name = type === 'page' ? page : ol
                                return <FilterLink {...router.query} page={p} name={name} />
                            }}
                        />
                    </div>
                </Col>
            </Row>
            <style jsx>{`
                .root{
                    padding: 20px 0;
                }
                .list-header {
                    font-weight: 800;
                    font-size: 16px;
                }
            `}</style>
        </div>
    )

}

Search.getInitialProps = async ({ ctx }) => {

    const { query, sort, lang, order, page } = ctx.query
    if (!query) {
        return {
            repos: {
                total_count: 0
            }
        }
    }
    let queryString = `?query=${query}`
    if (lang) queryString += `+language:${lang}`
    if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
    if (page) queryString += `&page=${page}`

    const result = await request({
        url: `/search/repositories${queryString}`
    }, ctx.req, ctx.res)

    return {
        repos: result.data
    }

}

export default Search