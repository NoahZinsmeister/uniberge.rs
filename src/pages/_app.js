import App from 'next/app'
import Head from 'next/head'

import Layout from '../components/Layout'
import useTheme from '../theme'

function AppFunctionComponent({ Component, pageProps }) {
  const theme = useTheme()

  return (
    <>
      <Head>
        <title>Unibergers</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
        <style jsx global>
          {`
            body {
              background-color: ${theme.colors.background};
              color: ${theme.colors.text};
            }
          `}
        </style>
      </Layout>
    </>
  )
}

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return <AppFunctionComponent Component={Component} pageProps={pageProps} />
  }
}
