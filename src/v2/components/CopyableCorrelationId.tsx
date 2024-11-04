import { Check, Copy, X } from "@phosphor-icons/react"
import { useState } from "react"
import { useCopyToClipboard } from "usehooks-ts"

export const CopyableCorrelationId = ({
  correlationId,
}: { correlationId: string }) => {
  const [, copyToClipboard] = useCopyToClipboard()
  const [isCopied, setIsCopied] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)

  const handleCopy = () => {
    copyToClipboard(correlationId).then((success) => {
      if (success) {
        setIsCopied(true)
        setHasFailed(false)
        setTimeout(() => setIsCopied(false), 2000)
      } else {
        setHasFailed(true)
        setTimeout(() => setHasFailed(false), 2000)
      }
    })
  }

  return (
    <pre
      className="group/copy flex cursor-pointer flex-row gap-1 text-xs opacity-60 hover:opacity-100"
      onClick={handleCopy}
    >
      {`ID: ${correlationId}`}
      {isCopied ? (
        <Check size={14} className="text-success" />
      ) : hasFailed ? (
        <X size={14} className="text-error" />
      ) : (
        <Copy
          size={14}
          className="opacity-0 transition-opacity group-hover/copy:opacity-100"
        />
      )}
    </pre>
  )
}
