import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Anchor } from "./ui/Anchor"

export const ReadOnlyBanner = () => (
  <div className="fixed top-0 left-0 z-tooltip flex h-12 w-full items-center bg-yellow-600 p-2 font-medium text-white">
    <span>Guild Classic is in read-only mode. Please use the new&nbsp;</span>
    <Anchor
      href="https://guild.xyz"
      className="inline-flex items-center gap-1.5 font-bold"
    >
      <span>Guild.xyz website</span>
      <ArrowRight weight="bold" />
    </Anchor>
  </div>
)
