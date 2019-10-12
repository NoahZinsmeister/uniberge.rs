import Link from 'next/link'

import Emoji from './Emoji'

export default function Layout({ children }) {
  return (
    <>
      <div className="header">
        <Link href="/">
          <a className="logo">
            <Emoji emoji="😉" label="wink" size="2.5rem" />
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

        .logo {
          margin: 1rem 0 0 1rem;
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
