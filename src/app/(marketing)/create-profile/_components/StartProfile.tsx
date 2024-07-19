import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { User } from "@phosphor-icons/react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { useState } from "react"

// TODO: use ConnectFarcasterButton
export const StartProfile = () => {
  const [startMethod, setStartMethod] = useState<"farcaster">()
  return (
    <Card className="mx-auto flex max-w-sm flex-col gap-3 bg-gradient-to-b from-card to-card-secondary p-8">
      <h1 className="mb-10 text-pretty text-center font-bold font-display text-2xl leading-none tracking-tight">
        Start your Guild Profile!
      </h1>
      <Avatar className="mb-8 size-36 self-center border bg-card-secondary">
        <AvatarFallback>
          <User size={32} />
        </AvatarFallback>
      </Avatar>

      {startMethod ? (
        <>
          <Label className="mb-2 space-y-3">
            <div>Name</div>
            <Input />
          </Label>
          <Label className="space-y-3">
            <div>Handle</div>
            <Input />
          </Label>
          <Button
            className="mt-6 w-full"
            colorScheme="success"
            onClick={() => setStartMethod(undefined)}
          >
            Start my profile
          </Button>
        </>
      ) : (
        <>
          <Button colorScheme="primary" onClick={() => setStartMethod("farcaster")}>
            Connect Farcaster
          </Button>
          <Button variant="ghost">
            I don't have a Farcaster profile
            <ArrowRight />
          </Button>
        </>
      )}
    </Card>
  )
}
