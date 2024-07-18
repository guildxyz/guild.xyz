import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { GuildPassScene } from "./GuildPassScene"

export const ClaimPass = () => {
  return (
    <Card className="mx-auto max-w-lg bg-gradient-to-b from-card to-card-secondary p-8">
      <div className="mb-12 h-48 w-full">
        <GuildPassScene />
      </div>
      <h1 className="mb-14 text-pretty text-center font-bold text-2xl leading-none tracking-tighter">
        Claim your Guild Pass and begin an epic adventure!
      </h1>
      <Label className="space-x-2">
        <div>Invite handle</div>
        <Input className="my-1 bg-card-secondary" />
      </Label>
      <p className="text-muted-foreground">Guild Pass is invite only</p>
      <Button colorScheme="success" className="mt-10 w-full">
        Continue
        <ArrowRight />
      </Button>
    </Card>
  )
}
