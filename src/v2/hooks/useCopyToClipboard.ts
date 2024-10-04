/**
 * We usually want to show a visual feedback for the user when they copy something to the clipboard, so we've created a custom wrapper with a timeout for `useCopyToClipboard` (usehooks-ts)
 */

import { useCallback, useEffect, useState } from "react"
import { useCopyToClipboard as _useCopyToClipBoard } from "usehooks-ts"

const useCopyToClipboard = (options: { timeout?: number } = { timeout: 2000 }) => {
  const [_, _originalCopyToClipboard] = _useCopyToClipBoard()

  const [hasCopied, setHasCopied] = useState(false)
  const copyToClipboard = useCallback(
    (text: string) => {
      _originalCopyToClipboard(text)
      setHasCopied(true)
    },
    [_originalCopyToClipboard]
  )

  useEffect(() => {
    let timeoutId: number | null = null

    if (hasCopied) {
      timeoutId = window.setTimeout(() => {
        setHasCopied(false)
      }, options.timeout)
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [options.timeout, hasCopied])

  return {
    hasCopied,
    copyToClipboard,
  }
}

export { useCopyToClipboard }
