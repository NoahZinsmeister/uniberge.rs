import { useState, useEffect, forwardRef, useRef } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import { FixedSizeList as List } from 'react-window'

import { getHost, convertStringTo8CodePoints, convertCodePointsToString } from '../utils'
import { useDefaultedDebounce } from '../hooks'
import { EMOJI } from '../constants'
import useTheme from '../theme'
import Emoji from '../components/Emoji'

const HANDS = ['👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿']

const CARD_HEIGHT = 100
const CARD_GUTTER_SIZE = 10
const EMOJI_SIZE = 60

async function getSearchResults(searchTerm, req) {
  return await fetch(`${getHost(req)}/api/search`, {
    method: 'POST',
    body: JSON.stringify({ searchTerm })
  }).then(response => {
    if (!response.ok) {
      throw Error(`${response.status} Error: ${response.statusText}`)
    } else {
      return response.json().then(({ indices }) => indices)
    }
  })
}

function Card({ setSearchTerm, index, data, style }) {
  const theme = useTheme()

  const emoji = EMOJI[data[index]]

  return (
    <div
      style={{
        ...style,
        top: style.top + CARD_GUTTER_SIZE,
        height: style.height - CARD_GUTTER_SIZE
      }}
    >
      <div className="card-wrapper">
        <div className="card-emoji">
          <Emoji emoji={emoji.char} label={emoji.name} size={`${EMOJI_SIZE}px`} />
        </div>

        <div className="card-body">
          <h3 className="card-body-name">
            <b>{emoji.name}</b>
          </h3>
          <button
            className="card-body-category"
            onClick={() => {
              setSearchTerm(emoji.category)
            }}
          >
            {emoji.category}
          </button>
        </div>

        <a
          className="card-link"
          href={`https://emojipedia.org/emoji/${emoji.char}/`}
          target="_blank"
          rel="noreferrer noopener"
        >
          ↗
        </a>
      </div>

      <style jsx>{`
        .card-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 100%;
          background-color: ${theme.colors.gray[index % 2 === 0 ? 10 : 9]};
          border-radius: 2rem;
        }

        .card-emoji {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1rem;
          min-width: 6rem;
        }

        .card-body {
          flex-grow: 1;
        }

        .card-body-name {
          width: fit-content;
        }

        .card-body-category {
          font-size: 0.75rem;
          margin: 0;
          padding: 0;
          color: theme.colors.gray[4];
          background-color: unset;
          cursor: pointer;
          width: fit-content;
          border: none;
        }

        .card-link {
          text-decoration: none;
          position: absolute;
          top: 0;
          right: 0;
          padding: 0.25rem;
          margin: 0.75rem;
        }

        .card-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

const innerElementType = forwardRef(({ style, ...rest }, ref) => (
  <div
    ref={ref}
    style={{
      ...style,
      paddingTop: CARD_GUTTER_SIZE
    }}
    {...rest}
  />
))

const cache = {}

function Home({ indices, initialSearch, initialSearchIndices, initialPosition }) {
  const ref = useRef() // for react-window
  const router = useRouter()
  const theme = useTheme()

  const [currentHandEmojiIndex, setCurrentHandEmojiIndex] = useState(0)

  // user input...
  const [searchTerm, setSearchTerm] = useState(initialSearch === null ? '' : initialSearch)
  // ...debounced
  const debouncedSearchTerm = useDefaultedDebounce(searchTerm, 200, '')

  // try to get the exact match for the search term
  let exactMatchIndex
  try {
    const normalizedSearchTerm = convertCodePointsToString(convertStringTo8CodePoints(searchTerm))
    const indexOf = EMOJI.findIndex(({ char }) => char === normalizedSearchTerm)
    if (indexOf === -1) {
      throw Error('No exact match.')
    }
    exactMatchIndex = indexOf
  } catch (error) {
    exactMatchIndex = null
  }

  // handle search results for the debounced search term
  const [searchIndices, setSearchIndices] = useState(initialSearchIndices)
  const [searchError, setSearchError] = useState()

  // define various helpful flags
  const loading = debouncedSearchTerm !== '' && searchIndices === null
  const noResults = searchIndices && searchIndices.length === 0
  const listToRender = loading ? [] : searchIndices || indices

  // handle debounced search term logic
  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      let stale = false

      if (debouncedSearchTerm === initialSearch || cache[debouncedSearchTerm]) {
        setSearchIndices(debouncedSearchTerm === initialSearch ? initialSearchIndices : cache[debouncedSearchTerm])
      } else {
        getSearchResults(debouncedSearchTerm)
          .then(indices => {
            cache[debouncedSearchTerm] = indices
            if (!stale) {
              setSearchIndices(indices)
            }
          })
          .catch(() => {
            setSearchError(true)
          })
      }

      return () => {
        stale = true
        setSearchIndices(null)
        setSearchError()
      }
    }
  }, [debouncedSearchTerm, initialSearch, initialSearchIndices])

  // scroll to initial position if needed
  useEffect(() => {
    if (initialPosition > 0) {
      ref.current.scrollToItem(initialPosition, 'start')
    }
  }, [initialPosition])

  // pin debounced search term to the url
  useEffect(() => {
    const { search, ...rest } = router.query

    if (debouncedSearchTerm === '') {
      if (search !== undefined) {
        router.push(
          {
            pathname: router.pathname,
            query: rest
          },
          undefined,
          { shallow: true }
        )
      }
    } else {
      if (search !== debouncedSearchTerm) {
        router.push(
          {
            pathname: router.pathname,
            query: { ...rest, search: debouncedSearchTerm }
          },
          undefined,
          { shallow: true }
        )
      }
    }
  }, [router, debouncedSearchTerm])

  return (
    <div className="wrapper">
      <h1 className="title">
        <Emoji
          emoji={HANDS[currentHandEmojiIndex]}
          label="wave"
          size="inherit"
          onClick={() => {
            setCurrentHandEmojiIndex(i => {
              let newIndex = i
              while (newIndex === i) {
                newIndex = Math.floor(Math.random() * HANDS.length)
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

      <div className="shim" />

      {loading && <p>Searching...</p>}
      {noResults && <p>No Results</p>}
      {searchError && <p>Unknown Error</p>}

      {exactMatchIndex && <p>Exact Match</p>}

      <List
        ref={ref}
        height={600}
        width={550}
        itemCount={listToRender.length}
        itemSize={CARD_HEIGHT + CARD_GUTTER_SIZE}
        itemData={listToRender}
        itemKey={(index, data) => EMOJI[data[index]].codes}
        onItemsRendered={({ visibleStartIndex }) => {
          const { position, ...rest } = router.query
          if (visibleStartIndex === 0) {
            router.push(
              {
                pathname: router.pathname,
                query: rest
              },
              undefined,
              { shallow: true }
            )
          } else {
            router.push(
              {
                pathname: router.pathname,
                query: { ...rest, position: visibleStartIndex }
              },
              undefined,
              { shallow: true }
            )
          }
        }}
        innerElementType={innerElementType}
      >
        {({ index, data, style }) => <Card setSearchTerm={setSearchTerm} index={index} data={data} style={style} />}
      </List>

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

        .shim {
          height: 1rem;
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = async context => {
  const { query, req } = context // query can contain: search, position

  const indices = [...Array(EMOJI.length).keys()]

  const initialSearch = query.search || null
  const initialSearchIndices = initialSearch === null ? null : await getSearchResults(initialSearch, req)

  const parsedPosition = Number.parseInt(query.position)
  const parsedPositionIsValid =
    Number.isInteger(parsedPosition) && parsedPosition > 0 && parsedPosition < (initialSearchIndices || indices).length
  const initialPosition = parsedPositionIsValid ? parsedPosition : null

  return { indices, initialSearch, initialSearchIndices, initialPosition }
}

export default Home
