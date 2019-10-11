import Emoji from '../components/Emoji'

export default function Home() {
  return (
    <div className="wrapper">
      <h1 className="title">
        Hi There <Emoji emoji="😉" label="wink" size="inherit" />
      </h1>
      <br />
      <p className="description">
        Welcome to Unibergers, a market-driven experiment in ownership, digital goods, and emoji. Coming soon
        <Emoji emoji="™️" label="tm" />.
      </p>
      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin: 3rem 1.5rem 3rem 1.5rem;
        }

        .title {
          line-height: 1;
        }

        .description {
          max-width: 40rem;
        }
      `}</style>
    </div>
  )
}
