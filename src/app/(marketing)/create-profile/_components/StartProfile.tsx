import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { User } from "@phosphor-icons/react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { AvatarFallback } from "@radix-ui/react-avatar"

// TODO: use ConnectFarcasterButton
export const StartProfile = () => {
  const startMethod = undefined
  return (
    <Card className="mx-auto flex max-w-sm flex-col gap-3 bg-gradient-to-b from-card to-card-secondary p-8">
      <h1 className="mb-10 text-pretty text-center font-bold text-2xl leading-none tracking-tighter">
        Start your Guild Profile!
      </h1>
      <Avatar className="mb-12 size-36 self-center">
        <AvatarFallback>
          <User size={32} />
        </AvatarFallback>
      </Avatar>

      <Button colorScheme="primary">Connect Farcaster</Button>
      <Button variant="subtle">
        I don't have a Farcaster profile
        <ArrowRight />
      </Button>

      {startMethod && (
        <>
          <Label className="space-y-2">
            <div>Name</div>
            <Input />
          </Label>
          <Label className="space-y-2">
            <div>Handle</div>
            <Input />
          </Label>
          <Button className="mt-8 w-full" colorScheme="success">
            Start my profile
          </Button>
        </>
      )}
    </Card>
  )
}
