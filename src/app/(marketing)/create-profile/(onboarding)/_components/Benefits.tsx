import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { BENEFITS } from "../constants"

export const Benefits = () => {
  return (
    <>
      <h2 className="text-center font-extrabold text-muted-foreground leading-none tracking-tighter">
        Benefits
      </h2>
      <p className="pb-5 text-center text-muted-foreground text-sm">
        All passes provide the same benefits
      </p>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {BENEFITS.map(({ title, description, isAvailable, image }) => (
          <Card
            className={cn(
              "flex items-center gap-4 border-2 border-transparent p-5",
              {
                "relative border-border border-dotted bg-transparent shadow-none":
                  !isAvailable,
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
              <Image src={image} alt="" width={28} height={28} />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </Card>
        ))}
      </div>
      <p className="pt-10 text-center text-muted-foreground text-sm">
        Prices are subject to change in the future
      </p>
    </>
  )
}
