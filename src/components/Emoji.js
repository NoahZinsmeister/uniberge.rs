import { useRef } from 'react'

export default function Emoji({
  emoji,
  label = 'emoji',
  size = '24px',
  onClick = false,
  unselectable = false,
  ...rest
}) {
  const ref = useRef()

  function wrappedOnClick(event) {
    ref.current.blur()
    onClick(event)
  }

  function onEnterPressed(event) {
    event.preventDefault()
    if (event.key === 'Enter') {
      onClick(event)
    }
  }

  return (
    <>
      <span
        ref={ref}
        role="img"
        aria-label={label}
        onClick={!!onClick ? wrappedOnClick : undefined}
        onKeyPress={!!onClick ? onEnterPressed : undefined}
        tabIndex={!!onClick ? 0 : undefined}
        {...rest}
      >
        {emoji}
      </span>
      <style jsx>{`
        span {
          user-select: ${!!onClick || unselectable ? 'none' : 'text'};
          font-size: ${size};
          line-height: 1;
        }

        span:hover {
          ${!!onClick &&
            `
          cursor: pointer;`}
        }

        span:active:focus {
          ${!!onClick &&
            `
            outline: none;`}
        }
      `}</style>
    </>
  )
}
