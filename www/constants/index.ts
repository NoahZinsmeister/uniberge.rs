import emoji from 'emoji.json'

export const EMOJI = emoji.filter(({ char }) => char.length <= 8)

// [
//   {
//     category: 'Smileys & Emotion (face-smiling)',
//     char: '😀',
//     codes: '1F600',
//     name: 'grinning face'
//   },
//   ...
// ]
