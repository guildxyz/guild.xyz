import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { Check, Copy } from "@phosphor-icons/react"
import { IconButton } from "./ui/IconButton"
import { ScrollArea, ScrollBar } from "./ui/ScrollArea"

export const CopyLink = ({ href }: { href: string }) => {
  const { hasCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div className="flex overflow-hidden rounded-lg border bg-secondary">
      <ScrollArea className="whitespace-nowrap px-2 py-2.5 font-mono text-muted-foreground text-sm">
        {href}
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
      <IconButton
        className="flex items-center justify-center rounded-none border-l"
        onClick={() => copyToClipboard(href)}
        icon={
          hasCopied ? (
            <Check weight="bold" className="text-success-subtle-foreground" />
          ) : (
            <Copy weight="bold" />
          )
        }
        aria-label="copy to clipboard"
        variant="ghost"
      />
    </div>
  )
}
