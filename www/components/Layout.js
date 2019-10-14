export default function Layout({ children }) {
  return (
    <>
      <div className="header"></div>

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
