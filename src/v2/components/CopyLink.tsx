import { Check, Clipboard } from "@phosphor-icons/react"
import { useState } from "react"
import { useCopyToClipboard } from "usehooks-ts"
import { IconButton } from "./ui/IconButton"
import { ScrollArea, ScrollBar } from "./ui/ScrollArea"

export const CopyLink = ({ href }: { href: string }) => {
  const [_, copy] = useCopyToClipboard()
  const [showSuccess, setShowSuccess] = useState(false)
  return (
    <div className="flex rounded-lg border bg-card">
      <ScrollArea className="whitespace-nowrap px-2 py-2.5 font-mono text-muted-foreground text-sm">
        {href}
        <ScrollBar orientation="horizontal" />
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
            <Check className="size-5 text-success-subtle-foreground" />
          ) : (
            <Clipboard className="size-5" />
          )
        }
        aria-label="copy to clipboard"
      />
    </div>
  )
}
