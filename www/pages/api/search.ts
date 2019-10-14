import { NowRequest, NowResponse } from '@now/node'

import { escapeStringRegex } from '../../utils'
import { EMOJI } from '../../constants'

const cache = {}

export default async function(req: NowRequest, res: NowResponse): Promise<NowResponse> {
  const { body } = req
  const { searchTerm } = JSON.parse(body || JSON.stringify({}))

  if (!searchTerm) {
    return res.status(400).send('')
  }

  const searchTermRegex = new RegExp(escapeStringRegex(searchTerm), 'i')

  const categoryRegex = (e: any): RegExp => new RegExp(escapeStringRegex(e.category), 'i')
  const charRegex = (e: any): RegExp => new RegExp(escapeStringRegex(e.char), 'i')
  const nameRegex = (e: any): RegExp => new RegExp(escapeStringRegex(e.name), 'i')

  const indices = EMOJI.map((e: any, i: number): number => {
    const match =
      e.category.match(searchTermRegex) ||
      e.char.match(searchTermRegex) ||
      e.name.match(searchTermRegex) ||
      searchTerm.match(categoryRegex(e)) ||
      searchTerm.match(charRegex(e)) ||
      searchTerm.match(nameRegex(e))

    return match ? i : null
  }).filter(i => i !== null)

  cache[searchTerm] = indices

  return res.status(200).json({ indices })
}
