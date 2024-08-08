import { Button } from "@/components/ui/Button"
import { House } from "@phosphor-icons/react/dist/ssr"
import GuildGhost from "static/avatars/58.svg"

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <GuildGhost className="size-24" />

      <h2 className="font-black font-display text-6xl">Profile not found</h2>

      <p className="font-medium"></p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <a href="/explorer">
          <Button colorScheme="primary" size="lg">
            <House weight="bold" />
            Go to home page
          </Button>
        </a>
      </div>
    </div>
  )
}

export default NotFound
