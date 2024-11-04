import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { Check, Copy } from "@phosphor-icons/react/dist/ssr"

export const CopyableCorrelationId = ({
  correlationId,
}: { correlationId: string }) => {
  const { hasCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <pre
      className="group/copy flex cursor-pointer flex-row gap-1 text-xs opacity-60 hover:opacity-100"
      onClick={() => copyToClipboard(correlationId)}
    >
      {`ID: ${correlationId}`}
      {hasCopied ? (
        <Check size={14} weight="bold" className="text-success" />
      ) : (
        <Copy
          size={14}
          className="opacity-0 transition-opacity group-hover/copy:opacity-100"
        />
      )}
    </pre>
  )
}
