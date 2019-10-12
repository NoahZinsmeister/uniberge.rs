/* eslint no-extend-native: 0 */

// adapted from https://github.com/zeit/next.js/blob/canary/examples/with-polyfills/client/polyfills.js

// core-js comes with Next.js. So, you can import it like below
import fromCodePoint from 'core-js/library/fn/string/from-code-point'

String.fromCodePoint = fromCodePoint
