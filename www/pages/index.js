import { useState, useMemo } from 'react'
import emoji from 'emoji.json'
import { motion } from 'framer-motion'

import { escapeStringRegex, convertStringTo8CodePoints, convertCodePointsToString } from '../utils'
import { useDebounce } from '../hooks'
import useTheme from '../theme'
import Emoji from '../components/Emoji'

const CARD_MARGIN = '1.25rem'
const CARD_SIZE = '5rem'
const EMOJI = emoji.filter(e => e.char.length <= 8)

const cardParentVariants = {
  start: { opacity: 0 },
  end: {
    opacity: 1,
    transition: {
      delay: 0,
      staggerChildren: 0.05
    }
  }
}

const cardChildrenVariants = {
  start: { opacity: 0, y: 25 },
  end: { opacity: 1, y: 0 }
}

function Card({ emoji, label }) {
  const theme = useTheme()

  return (
    <motion.div className="individual-card-wrapper" variants={cardChildrenVariants}>
      <Emoji emoji={emoji} label={label} size="inherit" unselectable={false} />

      <style jsx>{`
        :global(.individual-card-wrapper) {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${CARD_SIZE};
          line-height: 1;
          border-radius: 1.5rem;
          background-color: ${theme.colors.gray[9]};
          margin: ${CARD_MARGIN} ${CARD_MARGIN} 0 0;
          padding: calc(${CARD_SIZE} / 2);
        }
      `}</style>
    </motion.div>
  )
}

const DEFAULT_STATE = 'DEFAULT_STATE' // no user input
const TYPING_STATE = 'TYPING_STATE' // waiting for the debounced user input to catch up to the actual user input
const LOADED_STATE = 'LOADED_STATE' // user input === debounced user input

const HANDS = ['👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿']
function Home({ shuffledIndices }) {
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
    () => shuffledIndices.map(i => EMOJI[i]).map(e => <Card key={e.codes} emoji={e.char} label={e.name} />),
    [shuffledIndices]
  )
  const exactMatchCard =
    searchTermNormalized === '' ? null : (
      <Card key="exact-input" emoji={searchTermNormalized} label="typed-search-term" />
    )
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

  const [currentHandEmojiIndex, setCurrentHandEmojiIndex] = useState(0)

  return (
    <div className="wrapper">
      <h1 className="title">
        <Emoji
          emoji={HANDS[currentHandEmojiIndex]}
          label="wave"
          size="inherit"
          onClick={() => {
            setCurrentHandEmojiIndex(i => {
              let newIndex
              while (true) {
                newIndex = Math.floor(Math.random() * HANDS.length)
                if (newIndex !== i) {
                  break
                }
              }
              return newIndex
            })
          }}
        />{' '}
        Welcome to Unibergers
      </h1>

      <p className="description">A market-driven experiment in ownership, digital goods, and emoji</p>

      <input
        className="input"
        type="text"
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value)
        }}
        placeholder="Search..."
      />

      {exactMatchCard !== null && (
        <div className="blanket">
          <motion.div className="card-wrapper" variants={cardParentVariants} initial="start" animate="end">
            {exactMatchCard}
          </motion.div>
        </div>
      )}

      <div className="blanket">
        <motion.div className="card-wrapper" variants={cardParentVariants} initial="start" animate="end">
          {state === TYPING_STATE && <p>Loading...</p>}
          {state === DEFAULT_STATE && defaultCards}
          {state === LOADED_STATE && debouncedMatchCards}
        </motion.div>
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 2rem 1.5rem;
          width: 100%;
        }

        .title {
          line-height: 1;
          text-align: center;
        }

        .description {
          margin: 1rem 0 0 0;
          color: ${theme.colors.gray[4]};
          text-align: center;
        }

        .input {
          margin: 4rem 0 0 0;
          padding: 0.5rem 1rem 0.5rem 1rem;
          border-radius: 1rem;
          border: 0;
          width: 70%;
          max-width: 30rem;
        }

        .input:focus {
          outline: none;
        }

        .blanket {
          margin: 1rem 0 0 0;
          border-radius: 1.5rem;
          background-color: ${theme.colors.gray[10]};
          width: 100%;
        }

        :global(.card-wrapper) {
          display: flex;
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
  const indices = [...Array(EMOJI.length).keys()]
  indices.sort(() => 0.5 - Math.random())

  return {
    shuffledIndices: indices.slice(0, 11)
  }
}

export default Home
