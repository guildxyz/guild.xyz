import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { AvatarGroup } from "@/components/ui/AvatarGroup"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import { CaretDown } from "@phosphor-icons/react"
import { Users } from "@phosphor-icons/react/dist/ssr"

export const ContributionCard = () => {
  return (
    <Card className="flex flex-col border-2 md:flex-row">
      <div className="relative flex h-10 self-start rounded-br-2xl bg-border px-3 md:h-full md:w-10 md:rounded-br-none">
        <div className="md:-translate-x-1/2 md:-rotate-90 flex items-center gap-1 md:absolute md:bottom-1/2 md:left-1/2 md:translate-y-1/2">
          <Avatar size="sm">
            <AvatarFallback>#</AvatarFallback>
          </Avatar>
          <div className="max-w-12 truncate font-bold font-display">Guild</div>
        </div>
      </div>
      <div className="grid w-full grid-cols-[auto_1fr] items-center gap-4 p-6 md:grid-cols-[auto_auto_1fr]">
        <Avatar className="size-16 sm:size-20">
          <AvatarFallback>#</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-extrabold text-muted-foreground text-xs uppercase">
            TOP ROLE
          </div>
          <h3 className="mb-1 font-bold font-display text-xl tracking-tight">
            Enter Farcaster
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users weight="bold" className="min-w-4" />
            <p className="line-clamp-1 text-sm">Only 3.4% of users have this role</p>
          </div>
        </div>
        <div className="col-span-2 flex w-full flex-col gap-2 justify-self-end md:col-span-1 md:w-auto md:flex-row md:items-center">
          <Separator className="mb-2 md:hidden" />
          <div className="font-extrabold text-muted-foreground text-xs uppercase">
            COLLECTION:
          </div>
          <AvatarGroup imageUrls={["", "", ""]} count={87} size="lg" />
          <Button size="icon" variant="ghost" className="ml-2 hidden md:block">
            <CaretDown weight="bold" className="size-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
