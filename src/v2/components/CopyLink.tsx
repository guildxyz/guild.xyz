import { Check, Copy } from "@phosphor-icons/react"
import { useState } from "react"
import { useCopyToClipboard } from "usehooks-ts"
import { IconButton } from "./ui/IconButton"
import { ScrollArea, ScrollBar } from "./ui/ScrollArea"

export const CopyLink = ({ href }: { href: string }) => {
  const [_, copy] = useCopyToClipboard()
  const [showSuccess, setShowSuccess] = useState(false)
  return (
    <div className="flex overflow-hidden rounded-lg border bg-secondary">
      <ScrollArea className="whitespace-nowrap px-2 py-2.5 font-mono text-muted-foreground text-sm">
        {href}
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
      <IconButton
        className="flex items-center justify-center rounded-none border-l"
        onClick={() => {
          copy(href)
          setShowSuccess(true)
          window.setTimeout(() => setShowSuccess(false), 1000)
        }}
        icon={
          showSuccess ? (
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
