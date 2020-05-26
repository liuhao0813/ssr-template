import App from 'next/app'
import { Provider } from 'react-redux'
import withRedux from '../lib/with-redux'


class MyApp extends App {

    static async getInitialProps(ctx) {
        const { Component } = ctx
        let pageProps = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        return {
            pageProps
        }
    }

    render() {
        const { Component, pageProps, reduxStore } = this.props
        return (
            <Provider store={reduxStore}>
                <Component {...pageProps} />
            </Provider>
        )
    }
}


export default withRedux(MyApp)