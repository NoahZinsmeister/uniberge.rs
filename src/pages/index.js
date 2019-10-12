import { useState, useMemo } from 'react'
import emoji from 'emoji.json'

import { escapeStringRegex, convertStringTo8CodePoints, convertCodePointsToString } from '../utils'
import { useDebounce } from '../hooks'
import useTheme from '../theme'
import Emoji from '../components/Emoji'

const CARD_MARGIN = '1.25rem'
const EMOJI = emoji.filter(e => e.char.length <= 8)

function Card({ emoji, label }) {
  const theme = useTheme()

  const size = '8rem'

  return (
    <div className="wrapper">
      <Emoji emoji={emoji} label={label} size="inherit" unselectable={false} />

      <style jsx>{`
        .wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          height: ${size};
          font-size: calc(${size} / 1.75);
          border-radius: 1.5rem;
          background-color: ${theme.colors.gray[9]};
          margin: ${CARD_MARGIN} ${CARD_MARGIN} 0 0;
          padding: 0 calc(${size} / 4) 0 calc(${size} / 4);
        }
      `}</style>
    </div>
  )
}

const DEFAULT_STATE = 'DEFAULT_STATE' // no user input
const TYPING_STATE = 'TYPING_STATE' // waiting for the debounced user input to catch up to the actual user input
const LOADED_STATE = 'LOADED_STATE' // user input === debounced user input

function Home({ randomIndices }) {
  const theme = useTheme()

  // user input
  const [searchTerm, setSearchTerm] = useState('')

  // normalized search term used used for exact matches
  let searchTermNormalized
  try {
    searchTermNormalized = convertCodePointsToString(convertStringTo8CodePoints(searchTerm))
  } catch {
    searchTermNormalized = ''
  }

  // debounced search term used for filtering by regex matches
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const debouncedSearchTermEmoji = useMemo(() => {
    if (debouncedSearchTerm === '') {
      return []
    } else {
      const regex = new RegExp(escapeStringRegex(debouncedSearchTerm), 'i')
      return EMOJI.filter(e => e.category.match(regex) || e.char.match(regex) || e.name.match(regex))
    }
  }, [debouncedSearchTerm])

  const defaultCards = useMemo(
    () => randomIndices.map(i => EMOJI[i]).map(e => <Card key={e.codes} emoji={e.char} label={e.name} />),
    [randomIndices]
  )
  const exactMatchCard =
    searchTermNormalized === ''
      ? []
      : [<Card key="exact-input" emoji={searchTermNormalized} label="typed-search-term" />]
  const debouncedMatchCards = useMemo(
    () =>
      debouncedSearchTermEmoji
        .filter(e => e.char !== searchTermNormalized)
        .map(e => <Card key={e.codes} emoji={e.char} label={e.name} />),
    [debouncedSearchTermEmoji, searchTermNormalized]
  )

  function getState() {
    if (searchTerm === '') {
      return DEFAULT_STATE
    } else {
      if (searchTerm !== debouncedSearchTerm) {
        return TYPING_STATE
      } else {
        return LOADED_STATE
      }
    }
  }
  const state = getState()

  return (
    <div className="wrapper">
      <h1 className="title">
        Hi There <Emoji emoji="😉" label="wink" size="inherit" />
      </h1>

      <p className="description">
        Welcome to Unibergers, a market-driven experiment in ownership, digital goods, and emoji.
      </p>

      <input
        className="input"
        type="text"
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value)
        }}
        placeholder="..."
      />

      <div className="blanket">
        <div className="card-wrapper">
          {[
            ...exactMatchCard,
            ...(state === DEFAULT_STATE ? defaultCards : []),
            ...(state === LOADED_STATE ? debouncedMatchCards : [])
          ]}
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 40rem;
          margin: 3rem 1.5rem;
        }

        .title {
          line-height: 1;
        }

        .description {
          word-wrap: break-word;
          margin: 2rem 0 0 0;
        }

        .input {
          width: 100%;
          margin: 3rem 0 0 0;
        }

        .blanket {
          margin: 1rem 0 0 0;
          border-radius: 1.5rem;
          background-color: ${theme.colors.gray[10]};
          width: 100%;
        }

        .card-wrapper {
          display: inline-flex;
          flex-direction: row;
          justify-content: center;
          flex-wrap: wrap;
          margin: -${CARD_MARGIN} 0 0 0;
          padding: ${CARD_MARGIN};
          width: calc(100% + ${CARD_MARGIN});
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = () => {
  const randomIndices = Array(12)
    .fill(0)
    .map(() => Math.floor(Math.random() * EMOJI.length))

  return {
    randomIndices
  }
}

export default Home
