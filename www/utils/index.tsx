export const TOO_LONG_ERROR = 'TOO_LONG_ERROR'

export function escapeStringRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// from https://github.com/zeit/next.js/blob/canary/examples/with-cookie-auth/utils/get-host.js
// This is not production ready, (except with providers that ensure a secure host, like Now)
// For production consider the usage of environment variables and NODE_ENV
export function getHost(req: any): string {
  if (!req) {
    return ''
  }

  const { host } = req.headers

  if (host.startsWith('localhost')) {
    return `http://${host}`
  }

  return `https://${host}`
}

export function convertStringTo8CodePoints(input: string): number[] {
  const arrayedInput: string[] = Array.from(input)

  if (arrayedInput.length > 8) {
    throw Error(`${TOO_LONG_ERROR}: String contains more than 8 code points.`)
  }

  const codePoints: number[] = arrayedInput.map((i: string): number => i.codePointAt(0))

  return codePoints.concat(Array(8 - codePoints.length).fill(0))
}

export function convertCodePointsToString(codePoints: number[]): string {
  return String.fromCodePoint(...codePoints.filter(cp => cp !== 0))
}
