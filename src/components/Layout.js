import Link from 'next/link'

import useTheme from '../theme'

export default function Layout({ children }) {
  const theme = useTheme()

  return (
    <>
      <div className="header">
        <Link href="/">
          <a>
            <h3 className="header-text">Unibergers</h3>
          </a>
        </Link>
      </div>

      <div className="body">{children}</div>

      <style jsx>{`
        .header {
          display: flex;
        }

        a {
          text-decoration: none;
        }

        .header-text {
          line-height: 1;
          margin: 1rem 0 0 1rem;
          color: ${theme.colors.text};
        }

        .body {
          display: flex;
          flex-grow: 1;
          width: 100%;
          justify-content: center;
        }
      `}</style>
    </>
  )
}
