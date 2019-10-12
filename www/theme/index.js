import { lighten } from 'polished'

const WHITE = '#FFFFFF'
const BLACK = '#000000'

const GRAY_GRANULARITY = 10
const GRAY = Array.from(Array(GRAY_GRANULARITY + 2).keys()).reduce(
  (accumulator, currentValue) =>
    Object.assign({ [currentValue]: lighten(currentValue / (GRAY_GRANULARITY + 1), BLACK) }, accumulator),
  {}
)

const EMOJI_YELLOW = '#F1CA3B'

const DEFAULT = 'DEFAULT'

const BACKGROUND = {
  [DEFAULT]: lighten(0.25, EMOJI_YELLOW)
}
const TEXT = {
  [DEFAULT]: BLACK
}
const LINK = {
  [DEFAULT]: '#0000EE'
}

export default function useTheme() {
  return {
    colors: {
      background: BACKGROUND[DEFAULT],
      text: TEXT[DEFAULT],
      link: LINK[DEFAULT],
      white: WHITE,
      black: BLACK,
      emojiYellow: EMOJI_YELLOW,
      gray: GRAY
    }
  }
}
