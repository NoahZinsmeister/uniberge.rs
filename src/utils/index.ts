export function convertStringTo8CodePoints(input: string) {
  const codePoints: number[] = []
  for (let codePoint of input) {
    codePoints.push(codePoint.codePointAt(0))
  }

  if (codePoints.length > 8) {
    throw Error('String contains more than 8 code points.')
  }

  return codePoints.concat(Array(8 - codePoints.length).fill(0))
}

export function convertCodePointsToString(codePoints: number[]) {
  return String.fromCodePoint(...codePoints.filter(cp => cp !== 0))
}
