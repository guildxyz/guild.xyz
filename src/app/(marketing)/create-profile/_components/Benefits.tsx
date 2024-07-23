import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

interface Benefit {
  title: string
  description: string
  isAvailable: boolean
}

const BENEFITS = [
  {
    title: "Launch your Guild Profile",
    description: "Your onchain profile with achievements and XP level ",
    isAvailable: true,
  },
  {
    title: "Unlock exclusive rewards",
    description: "Pass holders can access unique and one-off rewards from guilds",
    isAvailable: true,
  },
  {
    title: "Get early access to Guild features",
    description: "Be the first to unlock and experience our newest features",
    isAvailable: true,
  },
  {
    title: "Priority support",
    description:
      "Get help within hours — even our CEO is answering priority tickets",
    isAvailable: true,
  },
  {
    title: "Manage your personal Guild",
    description:
      "Special access to gamified features to help creators engage their audience",
    isAvailable: false,
  },
  {
    title: "Alpha Explorer",
    description:
      "Unlock secret guilds and earn exclusive rewards before they become popular",
    isAvailable: false,
  },
  {
    title: "Be part of Gold community",
    description:
      "Shape Guild's future — your ideas drive what we build and when we build it",
    isAvailable: false,
  },
  {
    title: "Very top secret stuff",
    description:
      "There are things we can't tell you just yet — you'll have to see them for yourself",
    isAvailable: false,
  },
] as const satisfies Benefit[]

export const Benefits = () => {
  return (
    <>
      <h2 className="text-center font-bold text-muted-foreground text-xl leading-none tracking-tighter">
        Benefits
      </h2>
      <p className="pb-4 text-center text-muted-foreground">
        All passes provide the same benefits
      </p>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {BENEFITS.map(({ title, description, isAvailable }) => (
          <Card
            className={cn(
              "flex items-center gap-4 border-2 border-transparent p-5",
              {
                "bg- relative border-border border-dotted shadow-none": !isAvailable,
              }
            )}
            key={title}
          >
            {isAvailable || (
              <div className="absolute top-2 right-1 w-24 translate-x-1/3 rotate-45 select-none bg-card py-1 text-center font-semibold text-xs">
                Soon
              </div>
            )}
            <div
              className={cn(
                "flex aspect-square min-w-12 items-center justify-center rounded-xl bg-card-secondary",
                { "bg-muted": !isAvailable }
              )}
            >
              #
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </Card>
        ))}
      </div>
      <p className="pt-10 text-center text-muted-foreground">
        Prices are subject to change in the future
      </p>
    </>
  )
}
