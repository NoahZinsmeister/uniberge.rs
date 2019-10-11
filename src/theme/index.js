import { lighten } from 'polished'

const WHITE = '#FFFFFF'
const BLACK = '#000000'

const EMOJI_YELLOW = '#F1CA3B'

const DEFAULT = 'DEFAULT'

const BACKGROUND = {
  [DEFAULT]: lighten(0.3, EMOJI_YELLOW)
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
      emojiYellow: EMOJI_YELLOW
    }
  }
}
