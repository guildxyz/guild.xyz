import { ToastAction } from "@/components/ui/Toast"
import { useToast } from "@/components/ui/hooks/useToast"
import { XLogo } from "@phosphor-icons/react/dist/ssr"
import FarcasterLogo from "static/socialIcons/farcaster.svg"

const useToastWithShareButtons = () => {
  const { toast } = useToast()

  return ({ title, shareText }: { title: string; shareText: string }) =>
    toast({
      variant: "success",
      title,
      description: "Let others know as well by sharing it on Warpcast or X!",
      action: (
        <div className="flex items-center gap-1.5">
          <ToastAction altText="Cast" asChild>
            <a
              href={`https://warpcast.com/~/compose?text=${encodeURIComponent(
                shareText
              )}`}
              target="_blank"
            >
              <FarcasterLogo className="size-4" />
              <span>Cast</span>
            </a>
          </ToastAction>
          <ToastAction altText="Share" asChild>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
              )}`}
              target="_blank"
            >
              <XLogo className="size-4" />
              <span>Share</span>
            </a>
          </ToastAction>
        </div>
      ),
    })
}

export { useToastWithShareButtons }
