import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

const INVITE_HANDLE_ID = "invite-handle"

export const GuildPassInvite = () => {
  return (
    <Card className="mx-auto mt-8 max-w-lg bg-gradient-to-b from-card to-card-secondary p-8">
      <div className="mb-12 h-48 w-full outline">canvas placeholder</div>
      <h1 className="mb-14 text-center font-bold text-3xl leading-none tracking-tighter">
        Claim your Guild Pass and begin an epic adventure!
      </h1>
      <Label htmlFor={INVITE_HANDLE_ID}>Invite handle</Label>
      <Input id={INVITE_HANDLE_ID} className="my-1 bg-card-secondary" />
      <p className="text-muted-foreground">Guild Pass is invite only</p>
      <Button colorScheme="success" className="mt-10 w-full">
        Continue
        <ArrowRight />
      </Button>
    </Card>
  )
}
