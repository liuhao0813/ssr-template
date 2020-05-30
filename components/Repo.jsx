import Link from 'next/Link'
import moment from 'moment'
import { StarOutlined } from '@ant-design/icons'

function getLicense(license) {
    return license ? `${license.spdx_id} license` : ''
}

function getLastUpdated(time) {
    return moment(time).fromNow();
}

const Repo = ({ repo }) => {
    return (
        <div className="root">
            <div className="basic-info">
                <h3 className="repo-title">
                    <Link href={`/detail?owner=${repo.owner.login}&name=${repo.name}`} >
                        <a>{repo.full_name}</a>
                    </Link>
                </h3>
                <p className="repo-desc">{repo.description}></p>
                <p className="other-info">
                    {
                        repo.license ? (
                            <span className="license">{getLicense(repo.license)}</span>
                        ) : null
                    }
                    <span className="last-updated">{getLastUpdated(repo.updated_at)}</span>
                    <span className="open-issues">{repo.open_issues_count} open issues</span>
                </p>
            </div>
            <div className="lang-star">
                <span className="lang">{repo.language}</span>
                <span className="stars">
                    {repo.stargazers_count} <StarOutlined />
                </span>
            </div>
            <style jsx>{`
                .root{
                    display: flex;
                    justify-content: space-between;
                }
                .root + .root{
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                }
                .repo-title {
                    font-size: 20px;
                }
                .other-info > span{
                    margin-right: 10px;
                }
                .lang-star {
                    display: flex;
                    text-align: right;
                }
                .lang-star > span {
                    width: 120px;
                }
            `}</style>
        </div>
    )
}

export default Repo