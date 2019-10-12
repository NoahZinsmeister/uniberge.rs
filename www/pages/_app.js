import App from 'next/app'
import Head from 'next/head'

import Layout from '../components/Layout'
import useTheme from '../theme'

// css reset adapted from https://hankchizljaw.com/wrote/a-modern-css-reset/

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
            /* Box sizing rules */
            *,
            *::before,
            *::after {
              box-sizing: border-box;
            }

            /* global outline width */
            * {
              outline-width: thin;
            }

            /* Remove default padding */
            ul[class],
            ol[class] {
              padding: 0;
            }

            /* Remove default margin */
            body,
            h1,
            h2,
            h3,
            h4,
            p,
            ul[class],
            ol[class],
            li,
            figure,
            figcaption,
            blockquote,
            dl,
            dd {
              margin: 0;
            }

            /* Set core body defaults */
            body {
              font-family: 'Roboto', sans-serif;
              min-height: 100vh;
              scroll-behavior: smooth;
              text-rendering: optimizeSpeed;
              line-height: 1.5;
              background-color: ${theme.colors.background};
              color: ${theme.colors.text};
            }

            /* Inherit fonts for inputs and buttons */
            input,
            button,
            textarea,
            select {
              font: inherit;
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
