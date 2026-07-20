import { useCallback, useEffect, useRef, useState } from 'react'

function legacyCopy(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    textarea.remove()
  }
}

/** Copy text to the clipboard with a short-lived `copiedValue` for feedback. */
function useCopyToClipboard(resetAfterMs = 1500) {
  const [copiedValue, setCopiedValue] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const markCopied = useCallback(
    (text) => {
      setCopiedValue(text)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopiedValue(null), resetAfterMs)
    },
    [resetAfterMs]
  )

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        markCopied(text)
      } catch {
        if (legacyCopy(text)) markCopied(text)
      }
    },
    [markCopied]
  )

  return { copiedValue, copy }
}

export default useCopyToClipboard
