import Document, { Html, Head, Main, NextScript } from 'next/document'
import {ServerStyleSheet} from 'styled-components'

class MyDocument extends Document {

    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try{
            // 强化页面组件
            ctx.renderPage = () => originalRenderPage({
                enhanceApp: App => (props) => sheet.collectStyles(<App {...props}></App>),
                enhanceCompoent: Component => Component
            })

            const props = await Document.getInitialProps(ctx)

            return {
                ...props,
                styles: <>{props.styles}{sheet.getStyleElement()}</>
            }
        } finally {
            sheet.seal()
        }
       
        
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument