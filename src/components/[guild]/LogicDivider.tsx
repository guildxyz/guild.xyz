import { Separator } from "@/components/ui/Separator"
import { cn } from "@/lib/utils"
import { Logic } from "@guildxyz/types"
type Props = { logic: Logic; className?: string }

export const formattedLogic: Record<Logic, string> = {
  AND: "AND",
  OR: "OR",
  ANY_OF: "OR",
}

const LogicDivider = ({ logic, className }: Props): JSX.Element => (
  <div className={cn("flex items-center gap-4 py-2", className)}>
    <Separator variant="muted" className="shrink" />
    {/* TODO: Not sure if this custom text color is a good practice or not, we should think about it */}
    <div className="flex items-center justify-center font-bold text-muted-foreground/50 text-xs">
      {formattedLogic[logic]}
    </div>
    <Separator variant="muted" className="shrink" />
  </div>
)

export { LogicDivider }
